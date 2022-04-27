const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteAcl {
  constructor({ AclModel, CreateAclRepository, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.AclModel = AclModel;
    this.CreateAclRepository = CreateAclRepository;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<string>}
   */
  async removeAcl(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const acl = await this.CreateAclRepository.returnAclById(id);

    acl.deleted = true;
    await acl.save();
    return acl.id;
  }
}

module.exports = DeleteAcl;
