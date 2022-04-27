const { ObjectId } = require('mongoose').Types;
const { ErrorWithProps } = require('mercurius').default;
const { CreateVirtualhostSchema } = require('../../JoySchema/Virtualhost');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateVh {
  constructor({ ServerModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ServerModel = ServerModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async addVh(data) {
    const schema = CreateVirtualhostSchema();

    try {
      await schema.validateAsync(data, {
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

    const server = new this.ServerModel();

    const fields = Object.keys(data);
    fields.forEach((field) => {
      server[`${field}`] = data[`${field}`];
    });

    let result;
    try {
      result = await server.save();
    } catch (error) {
      MongooseErrorHandler(error);
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return result;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<boolean>}
   */
  async isVhExistById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const vh = await this.ServerModel.findOne({
      _id: new ObjectId(id),
    });

    if (!vh) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return true;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnActiveVhById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 400,
      });
    }
    const vh = await this.ServerModel.findOne({
      _id: new ObjectId(id),
      deleted: false,
    });

    if (!vh) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return vh;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnVhById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const vh = await this.ServerModel.findOne({
      _id: new ObjectId(id),
    });

    if (!vh) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return vh;
  }
}

module.exports = CreateVh;
