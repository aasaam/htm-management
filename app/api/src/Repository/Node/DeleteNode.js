const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteNode {
  constructor({ NodeModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.NodeModel = NodeModel;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeNode(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }

    const node = await this.NodeModel.findById(id);

    if (!node) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    node.deleted = true;
    await node.save();
    return node.id;
  }
}

module.exports = DeleteNode;
