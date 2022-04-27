/* eslint-disable sonarjs/no-identical-functions */
const fetch = require('node-fetch').default;
const { parallel } = require('async');
const FormData = require('form-data');
const { SignJWT } = require('jose');

const https = require('https');
const fs = require('fs');
const util = require('util');
// eslint-disable-next-line security/detect-child-process
const exec = util.promisify(require('child_process').exec);

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { CreateNodeSchema } = require('../../JoySchema/Node');

class HealthNode {
  constructor({
    RootCa,
    GenerateAllRepository,
    ActionSettingRepository,
    NodeModel,
    Config,
    AclModel,
    WafModel,
    ProtectionModel,
    UpstreamModel,
    ServerModel,
    ApplySettingRepository,
  }) {
    this.RootCa = RootCa;
    this.GenerateAllTemplate = GenerateAllRepository;
    this.SettingConf = ActionSettingRepository;
    this.NodeModel = NodeModel;
    this.alg = Config.ASM_AUTH_HMAC_ALG;
    this.timeout = Config.ASM_FETCH_TIMEOUT;
    this.AclModel = AclModel;
    this.WafModel = WafModel;
    this.ProtectionModel = ProtectionModel;
    this.UpstreamModel = UpstreamModel;
    this.ServerModel = ServerModel;
    this.ApplySettingRepository = ApplySettingRepository;
  }

  /**
   *
   * @param {*} nodeToken
   * @param {*} nodeIp
   * @returns
   */
  async signNodeToken(nodeToken, nodeIp) {
    const nowUnix = Math.floor(Date.now() / 1000) - 1;
    const secret = new TextEncoder().encode(nodeToken);
    const payload = {
      iss: nodeIp,
    };

    const ttl = 86400;
    return new SignJWT(payload)
      .setNotBefore(nowUnix)
      .setExpirationTime(nowUnix + ttl + 1)
      .setProtectedHeader({ alg: this.alg })
      .sign(secret);
  }
  /**
   *
   * @param {String} ip
   * @param {String} nodeToken
   * @param {String} tlsVersion
   * @param {String} port
   * @returns {Promise<object>}
   */

  async checkHealth(ip, nodeToken, port, tlsVersion, nodeId) {
    const input = {
      ip,
      nodeToken,
      tlsVersion,
      port,
      nodeId,
    };

    const schema = CreateNodeSchema();
    try {
      await schema.validateAsync(input, {
        abortEarly: false,
      });
    } catch (error) {
      const errorBag = [];

      error.details.forEach((item) => {
        errorBag.push({
          message: item.message,
          field: item.context.label,
        });
      });

      throw new ErrorWithProps(errorConstMerge.UNPROCESSABLE_ENTITY, {
        validation: errorBag,
        statusCode: 422,
      });
    }

    const url = `https://${ip}:${port}/health`;
    const secret = await this.signNodeToken(nodeToken, ip);
    const headers = {
      'Content-Type': 'application/json',
      'X-Token': secret,
    };

    const options = {
      method: 'GET',
      ca: [this.RootCa],
    };

    const sslConfiguredAgent = new https.Agent(options);

    // @ts-ignore
    const res = await fetch(url, {
      headers,
      agent: sslConfiguredAgent,
      timeout: this.timeout,
    });

    let data;

    try {
      data = await res.json();
    } catch (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   *
   * @param {*} ip
   * @param {*} port
   * @param {*} nodeToken
   * @returns
   */
  async checkNodeInfo(ip, port, nodeToken) {
    const url = `https://${ip}:${port}/info`;

    const secret = await this.signNodeToken(nodeToken, ip);
    const headers = {
      'Content-Type': 'application/json',
      'X-Token': secret,
    };

    const options = {
      method: 'GET',
      ca: [this.RootCa],
    };

    const sslConfiguredAgent = new https.Agent(options);

    // @ts-ignore
    const res = await fetch(url, {
      headers,
      agent: sslConfiguredAgent,
      timeout: this.timeout,
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error(error);
    }

    return data;
  }

  /**
   *
   */
  async nodeApply() {
    await this.GenerateAllTemplate.generateAllConfFile();
    const config = await this.SettingConf.getNginxConf('nginxconf');

    await fs.promises.writeFile('/app/api/addon/gomplates/nginx.tmpl', config);

    const { stderr } = await exec(
      [
        `cd /tmp/`,
        `rm -rf addon`,
        `cp -r /app/api/addon /tmp/`,
        `tar -czf addon.tar.gz addon`,
      ].join(' && '),
    );

    if (stderr) {
      throw new Error(`${stderr}`);
    }

    // get all node
    const node = await this.NodeModel.find({
      deleted: false,
    }).select('id ip port nodeToken nodeId');

    const formData = new FormData();

    const stats = fs.statSync('/tmp/addon.tar.gz');

    const fileSizeInBytes = stats.size;
    const readStream = fs.createReadStream('/tmp/addon.tar.gz');

    formData.append('addon.tgz', readStream, {
      knownLength: fileSizeInBytes,
    });

    const httpsAgent = new https.Agent({
      ca: [this.RootCa],
    });

    const newNodeList = await Promise.all(
      node.map(async (item) => {
        // eslint-disable-next-line sonarjs/prefer-object-literal
        const container = {};
        container.id = item.id;
        container.ip = item.ip;
        container.port = item.port;
        container.nodeToken = await this.signNodeToken(item.nodeToken, item.ip);
        container.nodeId = item.nodeId;
        return container;
      }),
    );

    // apply config to all active node
    const parallelItems = [];
    const data = [];
    let success = true;
    const mongoIdRegex = /([a-f0-9]{24})/g;
    let mongoIdObjects = [];
    newNodeList.forEach((item) => {
      parallelItems.push((callback) => {
        formData.getHeaders = () => ({
          'Content-length': fileSizeInBytes,
          'X-Token': item.nodeToken,
        });

        const itemData = {
          nodeId: item.nodeId,
          ip: item.ip,
        };

        const errorFunc = (err) => {
          success = false;
          data.push({
            item: itemData,
            err: err.message,
          });
          callback(null);
        };

        // console.log(formData.getHeaders());
        fetch(`https://${item.ip}:${item.port}/update`, {
          method: 'POST',
          body: formData,
          agent: httpsAgent,
          headers: formData.getHeaders(),
          timeout: this.timeout,
        })
          .then((res) => {
            res
              .json()
              .then((jsonData) => {
                if (res.status === 200) {
                  data.push({
                    item: itemData,
                    body: jsonData,
                  });
                  callback(null);
                } else {
                  if (mongoIdRegex.test(jsonData)) {
                    const matched = jsonData.match(mongoIdRegex);
                    mongoIdObjects.push(matched[0]);
                  }
                  errorFunc(new Error(jsonData));
                }
              })
              .catch(errorFunc);
          })
          .catch(errorFunc);
      });
    });

    mongoIdObjects = [...new Set(mongoIdObjects)];

    await new Promise((resolve) => {
      parallel(parallelItems, (_, res) => {
        resolve(res);
      });
    });

    const errorInfo = await this.searchToAllCollection(mongoIdObjects);

    if (!success) {
      throw new ErrorWithProps(errorConstMerge.INTERNAL_SERVER_ERROR, {
        statusCode: 500,
        validation: data,
        errorInfo,
      });
    }

    return data;
  }

  /**
   *
   * @returns {Promise<object>}
   */
  async nodeRestart() {
    // get all node
    const node = await this.NodeModel.find({
      deleted: false,
    }).select('id ip port nodeId nodeToken');

    const httpsAgent = new https.Agent({
      ca: [this.RootCa],
    });

    const newNodeList = await Promise.all(
      node.map(async (item) => {
        // eslint-disable-next-line sonarjs/prefer-object-literal
        const container = {};
        container.id = item.id;
        container.ip = item.ip;
        container.port = item.port;
        container.nodeToken = await this.signNodeToken(item.nodeToken, item.ip);
        container.nodeId = item.nodeId;
        return container;
      }),
    );

    // reset config to all active node
    const parallelItems = [];
    const data = [];
    let success = true;
    const mongoIdRegex = /([a-f0-9]{24})/g;
    let mongoIdObjects = [];
    newNodeList.forEach((item) => {
      parallelItems.push((callback) => {
        const itemData = {
          nodeId: item.nodeId,
          ip: item.ip,
        };

        const errorFunc = (err) => {
          success = false;
          data.push({
            item: itemData,
            err: err.message,
          });
          callback(null);
        };

        fetch(`https://${item.ip}:${item.port}/restart`, {
          method: 'POST',
          agent: httpsAgent,
          headers: {
            'X-Token': item.nodeToken,
          },
          timeout: this.timeout,
        })
          .then((res) => {
            res
              .json()
              .then((jsonData) => {
                if (res.status === 200) {
                  data.push({
                    item: itemData,
                    body: jsonData,
                  });
                  callback(null);
                } else {
                  if (mongoIdRegex.test(jsonData)) {
                    const matched = jsonData.match(mongoIdRegex);
                    mongoIdObjects.push(matched[0]);
                  }
                  errorFunc(new Error(jsonData));
                }
              })
              .catch(errorFunc);
          })
          .catch(errorFunc);
      });
    });

    mongoIdObjects = [...new Set(mongoIdObjects)];

    await new Promise((resolve) => {
      parallel(parallelItems, (_, res) => {
        resolve(res);
      });
    });

    const errorInfo = await this.searchToAllCollection(mongoIdObjects);

    if (!success) {
      throw new ErrorWithProps(errorConstMerge.INTERNAL_SERVER_ERROR, {
        statusCode: 500,
        validation: data,
        errorInfo,
      });
    }

    if (success) {
      await this.ApplySettingRepository.updateLastApplyTime();
    }

    return data;
  }

  /**
   *
   * @param {*} mongoIdObjects
   */
  async searchToAllCollection(mongoIdObjects) {
    const errorInfo = {
      waf: [],
      acl: [],
      protection: [],
      upstream: [],
      virtualhost: [],
    };
    const wafData = await this.WafModel.find({
      _id: {
        $in: mongoIdObjects,
      },
    });

    const aclData = await this.AclModel.find({
      _id: {
        $in: mongoIdObjects,
      },
    });

    const protectionData = await this.ProtectionModel.find({
      _id: {
        $in: mongoIdObjects,
      },
    });

    const upstreamData = await this.UpstreamModel.find({
      _id: {
        $in: mongoIdObjects,
      },
    });

    const serverData = await this.ServerModel.find({
      _id: {
        $in: mongoIdObjects,
      },
    });

    if (wafData.length > 0) {
      wafData.forEach((item) => {
        errorInfo.waf.push({
          id: item.id,
          name: item.profileName,
        });
      });
    } else if (aclData.length > 0) {
      aclData.forEach((item) => {
        errorInfo.acl.push({
          id: item.id,
          name: item.name,
        });
      });
    } else if (protectionData.length > 0) {
      protectionData.forEach((item) => {
        errorInfo.protection.push({
          id: item.id,
          name: item.name,
        });
      });
    } else if (upstreamData.length > 0) {
      upstreamData.forEach((item) => {
        errorInfo.upstream.push({
          id: item.id,
          name: item.name,
        });
      });
    } else if (serverData.length > 0) {
      serverData.forEach((item) => {
        errorInfo.virtualhost.push({
          id: item.id,
          name: item.name,
        });
      });
    }

    return errorInfo;
  }
}

module.exports = HealthNode;
