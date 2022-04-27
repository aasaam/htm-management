const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteUpstream {
  constructor({ UpstreamModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UpstreamModel = UpstreamModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeUpstream(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const upstream = await this.UpstreamModel.findById(id);

    upstream.deleted = true;
    await upstream.save();

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return upstream.id;
  }
}

module.exports = DeleteUpstream;
