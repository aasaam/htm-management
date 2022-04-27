const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteWaf {
  constructor({ WafModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.WafModel = WafModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeWaf(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const waf = await this.WafModel.findById(id);
    if (!waf) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    waf.deleted = true;
    await waf.save();

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return waf.id;
  }
}

module.exports = DeleteWaf;
