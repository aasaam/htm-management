const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ProfileUser {
  constructor({ UserModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
  }

  /**

   * @param {String} id
   * @returns {Promise<Object>}
   */
  async profileUserData(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.USER_NOT_FOUND, {
        statusCode: 404,
      });
    }
    return user;
  }
}

module.exports = ProfileUser;
