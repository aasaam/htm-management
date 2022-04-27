const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteVh {
  constructor({ ServerModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ServerModel = ServerModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeVh(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const vh = await this.ServerModel.findById(id);
    vh.deleted = true;

    await vh.save();
    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return vh.id;
  }
}

module.exports = DeleteVh;
