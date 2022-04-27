const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const {
  UpdateUserSchemaSA,
  UpdateUserSchemaME,
} = require('../../JoySchema/User');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class EditUser {
  constructor({ UserModel, CreateUserRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
    this.CreateUserRepository = CreateUserRepository;
  }

  /**
   * @param {String} id
   * @param {String} email
   * @param {String} roles
   * @param {Boolean} active
   */
  async editUserBySuperadmin(id, email, roles, active) {
    const input = {
      id,
      email,
      roles,
      active,
    };

    const schema = UpdateUserSchemaSA();

    try {
      await schema.validateAsync(input, {
        abortEarly: false,
      });
    } catch (error) {
      const errorBag = [];
      error.details.forEach((item) => {
        errorBag.push({
          message: item.message,
          field: item.context.label,
        });
      });
      throw new ErrorWithProps(errorConstMerge.UNPROCESSABLE_ENTITY, {
        validation: errorBag,
        statusCode: 422,
      });
    }

    const user = await this.CreateUserRepository.ReturnUserExistById(id);

    const valid = await user.setEmail(email);
    if (valid) {
      user.email = email;
    }
    user.roles = roles;
    user.active = active;

    let result;
    try {
      result = await user.save();
    } catch (e) {
      if (e) {
        MongooseErrorHandler(e);
      }
    }
    return result;
  }

  /**
   * @param {String} id
   * @param {String} email
   */
  async editUserByMember(id, email) {
    const input = {
      id,
      email,
    };

    const schema = UpdateUserSchemaME();

    try {
      await schema.validateAsync(input, {
        abortEarly: false,
      });
    } catch (error) {
      const errorBag = [];
      // eslint-disable-next-line sonarjs/no-identical-functions
      error.details.forEach((item) => {
        errorBag.push({
          message: item.message,
          field: item.context.label,
        });
      });
      throw new ErrorWithProps(errorConstMerge.UNPROCESSABLE_ENTITY, {
        validation: errorBag,
        statusCode: 422,
      });
    }

    const user = await this.CreateUserRepository.ReturnUserExistById(id);

    user.email = (await user.setEmail(email)) ? email : user.email;

    let result;
    try {
      result = await user.save();
    } catch (e) {
      if (e) {
        MongooseErrorHandler(e);
      }
    }
    return result;
  }
}

module.exports = EditUser;
