const validator = require('validator').default;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class Authentication {
  constructor({ UserModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
  }

  /**
   * @param {Object} param
   * @param {String} [param.email]
   * @param {String} [param.password]
   * @param {String} [param.otp]
   * @returns {Promise<Boolean>}
   */

  async signIn({ email, password, otp }) {
    let valid = false;

    const user = await this.UserModel.findOne({
      email: validator.normalizeEmail(email),
      deleted: false,
      active: true,
    });

    if (!user) {
      valid = false;
    }

    if (user && password) {
      valid = await user.verifyPassword(password);
    } else if (otp) {
      valid = await user.verifyOtp(otp);
    }

    if (!valid) {
      throw new ErrorWithProps(errorConstMerge.UNAUTHORIZED, {
        statusCode: 401,
      });
    }

    return user;
  }

  /**
   *
   * @param {*} id
   */
  async lastLogin(id) {
    const user = await this.UserModel.findById(id);
    if (user) {
      user.lastLogin = Date.now();
    }
    await user.save();
  }
}

module.exports = Authentication;
