const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

/**
 * @description This class is responsible for handling the logic of the resetting password withouts the need of authentication.
 *
 */
class ResetPasswordUser {
  constructor({ UserModel, CreateUserRepository, Redis }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.Redis = Redis;
    this.UserModel = UserModel;
    this.CreateUserRepository = CreateUserRepository;
  }

  async resetPassword(token, newpassword) {
    if (!token) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    if (!newpassword) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_PASSWORD, {
        statusCode: 422,
      });
    }

    // @ts-ignore
    const redis = await this.Redis.getRedis();
    const userId = await redis.get(`forget_password:${token}`);

    if (userId) {
      const user = await this.UserModel.findOne({
        _id: userId,
        active: true,
      });

      if (user) {
        await user.setPassword(newpassword);
        await user.save();
        await redis.del(`forget_password:${token}`);
        return true;
      }
    }

    throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
      statusCode: 400,
    });
  }
}

module.exports = ResetPasswordUser;
