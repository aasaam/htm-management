const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class OtpGenerator {
  constructor({ UserModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
  }

  async generateNewOtpSecret({ id, currentPassword, admin = false }) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    if (!admin && !currentPassword) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_PASSWORD, {
        statusCode: 400,
      });
    }

    const user = await this.UserModel.findById(id);
    let otpSecret = '';

    if (currentPassword) {
      const isValidPassword = await user.verifyPassword(currentPassword);
      if (!isValidPassword) {
        throw new ErrorWithProps(errorConstMerge.INVALID_PASSWORD, {
          statusCode: 400,
        });
      }
    }

    otpSecret = await user.setNewOtpSecret();
    await user.save();

    return otpSecret;
  }
}

module.exports = OtpGenerator;
