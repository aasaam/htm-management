/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */
/* eslint-disable class-methods-use-this */
/* eslint-disable security/detect-child-process */
/* eslint-disable no-plusplus */

const fs = require('fs');
const util = require('util');

const exec = util.promisify(require('child_process').exec);
const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { CreateCertSchema } = require('../../JoySchema/Certificate');

class CreateCertificate {
  constructor({ CertificateModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.CertificateModel = CertificateModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} name
   * @param {String} fullChain
   * @param {String} privateKey
   * @param {String} chain
   * @returns
   */

  async addCertificate(name, fullChain, privateKey, chain) {
    const input = {
      name,
      fullChain,
      privateKey,
      chain,
    };
    const schema = CreateCertSchema();

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

    const cert = new this.CertificateModel();

    const bufferData = {
      certificateBuff: await this.decodeBase64(fullChain),
      privateKeyBuff: await this.decodeBase64(privateKey),
      caBuff: await this.decodeBase64(chain),
    };

    const promises = [];
    Object.keys(bufferData).forEach((item) => {
      promises.push(this.writePemFile('/tmp/', item, bufferData[item]));
    });

    await Promise.all(promises);

    const str = bufferData.certificateBuff.toString();
    const splittedCertResult = this.splitCert(str);
    const splittedNumber = splittedCertResult.length;

    for (let index = 0; index < splittedNumber; index++) {
      promises.push(this.processCertificate(splittedCertResult[index], index));
    }
    const result = (await Promise.all(promises)).filter((r) => !!r);

    if (result) {
      // @ts-ignore
      const info = result['0'].data;
      cert.issuer = info.issuer.organization;
      cert.sans = info.sans;
      cert.not_before = info.not_before;
      cert.notAfter = info.not_after;
      cert.sigalg = info.sigalg;
    }

    const isVerifyFullChain = await this.verifyFullChain();
    const isVerifyPrivKey = await this.verifyPrivKey();
    if (isVerifyFullChain === isVerifyPrivKey) {
      cert.name = name;
      cert.fullChain = bufferData.certificateBuff;
      cert.privateKey = bufferData.privateKeyBuff;
      cert.chain = bufferData.caBuff;
      await cert.save();
    } else {
      throw new ErrorWithProps(errorConstMerge.NOT_MATCH_KEYCHAIN, {
        statusCode: 400,
      });
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();

    return cert.id;
  }

  /**
   *
   * @param {String} input
   * @returns{Promise<Buffer>}
   */
  async decodeBase64(input) {
    if (!input) {
      return null;
    }
    return Buffer.from(input, 'base64');
  }

  async writeSsl() {
    const cert = await this.findAllCertificate();

    const filePath = '/app/api/addon/ssl';
    const { stderr } = await exec(`rm -rf ${filePath}/*.pem`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }

    // write pem to ssl addon folder
    const sslPromises = [];
    if (cert.length) {
      for (let index = 0; index < cert.length; index++) {
        sslPromises.push(
          this.writePemFile(
            filePath,
            `ssl_${cert[index].id}_fullchain`,
            cert[index].fullChain,
          ),
        );
        sslPromises.push(
          this.writePemFile(
            filePath,
            `ssl_${cert[index].id}_privkey`,
            cert[index].privateKey,
          ),
        );
        sslPromises.push(
          this.writePemFile(
            filePath,
            `ssl_${cert[index].id}_chain`,
            cert[index].chain,
          ),
        );
      }
      await Promise.all(sslPromises);
    }
  }

  /**
   *
   * @param {*} filePath
   * @param {*} fileName
   * @param {*} fileValue
   */
  async writePemFile(filePath, fileName, fileValue) {
    fs.writeFile(`${filePath}/${fileName}.pem`, fileValue, (err) => {
      if (err) {
        throw new Error('error accrued while creating pem file.');
      }
    });
  }

  /**
   *
   * @param {String} stringValue
   */
  splitCert(stringValue) {
    return stringValue.match(
      /([-]+BEGIN\sCERTIFICATE[\\-]+[^\\-]+[\\-]+END\sCERTIFICATE[\\-]+)/gs,
    );
  }

  /**
   *
   * @param {*} certData
   * @param {*} index
   */
  async processCertificate(certData, index) {
    const filePath = `/tmp/cert_${index}.pem`;
    await fs.promises.writeFile(filePath, certData);
    const { stdout } = await exec(`cfssl-certinfo -cert ${filePath}`);
    if (stdout) {
      const data = JSON.parse(stdout);
      if (data.sans) {
        return { index, data: JSON.parse(stdout) };
      }
    }
    return false;
  }

  /**
   *
   * @returns {Promise}
   */
  async verifyFullChain() {
    const filePath = `/tmp/certificateBuff.pem`;
    const { stdout } = await exec(
      `openssl x509 -noout -pubkey -in ${filePath}`,
    );
    if (stdout) {
      return stdout;
    }
    return false;
  }

  /**
   *
   * @returns {Promise}
   */
  async verifyPrivKey() {
    const filePath = `/tmp/privateKeyBuff.pem`;
    const { stdout } = await exec(`openssl pkey -pubout -in ${filePath}`);
    if (stdout) {
      return stdout;
    }
    return false;
  }

  /**
   *
   * @param {String} id
   * @returns{Promise<object>}
   */
  async findCertificateById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const certificate = await this.CertificateModel.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return certificate;
  }

  /**
   *
   * @returns{Promise<object>}
   */
  async findAllCertificate() {
    return this.CertificateModel.find({ deleted: false });
  }
}

module.exports = CreateCertificate;
