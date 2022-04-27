const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DeleteUser {
  constructor({ UserModel, CreateUserRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;

    this.CreateUserRepository = CreateUserRepository;
  }

  /**
   *
   * @param {*} id
   * @returns {Promise<object>}
   */
  async removeUserById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const user = await this.CreateUserRepository.ReturnUserExistById(id);

    user.deleted = true;
    user.active = false;
    await user.save();
    return user;
  }
}

module.exports = DeleteUser;
