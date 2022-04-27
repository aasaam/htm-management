const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { CreateNodeSchema } = require('../../JoySchema/Node');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateNode {
  constructor({ NodeModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.NodeModel = NodeModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} ip
   * @param {String} nodeToken
   * @param {String} tlsVersion
   * @param {String} port
   * @returns {Promise<object>}
   */
  async addNode(ip, nodeToken, tlsVersion, port, nodeId) {
    const node = new this.NodeModel();

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

    node.ip = ip;
    node.nodeToken = nodeToken;
    node.tlsVersion = tlsVersion;
    node.port = port;
    node.nodeId = nodeId;

    let result;
    try {
      result = await node.save();
    } catch (error) {
      if (error) {
        MongooseErrorHandler(error);
      }
    }
    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return result;
  }

  /**
   *
   * @param {String} ip
   * @returns {Promise<string>}
   */
  async findNodeByIp(ip) {
    if (!ip) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const node = await this.NodeModel.findOne({
      ip,
    });

    if (!node) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return node.id;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnNodeById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const node = await this.NodeModel.findOne({
      _id: new ObjectId(id),
    });

    if (!node) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return node;
  }
}

module.exports = CreateNode;
