const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { UpdateNodeSchema } = require('../../JoySchema/Node');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class EditNode {
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
   * @param {String} id
   * @returns {Promise<string>}
   */
  async updateNode(id, ip, nodeToken, tlsVersion, port, nodeId, deleted) {
    const input = {
      id,
      ip,
      nodeToken,
      tlsVersion,
      port,
      nodeId,
      deleted,
    };

    const schema = UpdateNodeSchema();
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

    const node = await this.NodeModel.findById(id);
    if (!node) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    node.ip = ip;
    node.nodeToken = nodeToken;
    node.tlsVersion = tlsVersion;
    node.port = port;
    node.nodeId = nodeId;
    node.deleted = deleted;

    let result;
    try {
      result = await node.save();
    } catch (error) {
      MongooseErrorHandler(error);
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return result.id;
  }
}

module.exports = EditNode;
