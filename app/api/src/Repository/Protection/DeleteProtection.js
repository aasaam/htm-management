const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteProtection {
  constructor({ ProtectionModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ProtectionModel = ProtectionModel;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeProtection(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 422,
      });
    }
    const profile = await this.ProtectionModel.findById(id);

    profile.deleted = true;
    await profile.save();
    return profile.id;
  }
}

module.exports = DeleteProtection;
