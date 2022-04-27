const validator = require('validator').default;
const { ObjectId } = require('mongoose').Types;

const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { CreateUserSchema: userJoiSchema } = require('../../JoySchema/User');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateUser {
  constructor({ UserModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
  }

  /**
   * @param {String} email
   * @param {String} password
   * @param {String} roles
   * @param {Boolean} active
   */
  async addUser(email, password, roles, active = true) {
    const input = {
      email,
      password,
      roles,
      active,
    };

    const schema = userJoiSchema();

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

    const user = new this.UserModel();

    const valid = await user.setEmail(email);
    if (valid) {
      user.email = email;
    }

    await user.setPassword(password);
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
   * @param {Object} param
   * @param {String} [param.email]
   * @returns {Promise<Boolean>}
   */
  async isUserExist({ email }) {
    if (email) {
      const user = await this.UserModel.findOne({
        email: validator.normalizeEmail(email),
      });
      return !!user;
    }

    throw new ErrorWithProps(errorConstMerge.ISREQUIRE_EMAIL, {
      statusCode: 404,
    });
  }

  // /**
  //  * @param {Object} param
  //  * @param {String} [param.email]
  //  * @returns {Promise<Boolean>}
  //  */
  // async returnUserExist({ email }) {
  //   if (email) {
  //     return this.UserModel.findOne({
  //       email: validator.normalizeEmail(email),
  //     });
  //   }

  //   throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
  //     statusCode: 404,
  //   });
  // }

  /**
   * @param {String} id
   * @returns {Promise<Object>}
   */
  async ReturnUserExistById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 404,
      });
    }

    const user = await this.UserModel.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return user;
  }

  /**
   * @param {Object} param
   * @param {String} param.email
   * @returns {Promise<String>}
   */
  async getUserId({ email }) {
    if (email) {
      const u = await this.UserModel.findOne({
        email: validator.normalizeEmail(email),
      });

      return u && u.id.toString();
    }

    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  /**
   * @param {String} email
   * @return {Promise<String>}
   */
  async generatePasswordAndSet(email) {
    let generatedPassword = '';
    let failed = true;

    while (failed) {
      generatedPassword = crypto
        .createHash('sha256')
        .update(`${Date.now()}:${Math.random()}`)
        .digest('base64')
        .replace(/[^a-z0-9]/gi, '')
        .replace(/1/g, '!')
        .replace(/a/g, '@')
        .replace(/S/g, '$')
        .substr(0, 16);

      if (validator.isStrongPassword(generatedPassword)) {
        failed = false;
      }
    }

    if (email) {
      const user = await this.UserModel.findOne({ email });
      if (user) {
        await user.setPassword(generatedPassword);
        await user.save();
      }
    }

    return generatedPassword;
  }

  /**
   * @return {Promise<String>}
   */
  // eslint-disable-next-line class-methods-use-this
  async generateStrongPassword() {
    return crypto
      .createHash('sha256')
      .update(`${Date.now()}:${Math.random()}`)
      .digest('base64')
      .replace(/[^a-z0-9]/gi, '')
      .replace(/1/g, '!')
      .replace(/a/g, '@')
      .replace(/S/g, '$')
      .substr(0, 16);
  }
}

module.exports = CreateUser;
