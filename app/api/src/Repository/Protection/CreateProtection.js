const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { CreateProtectionSchema } = require('../../JoySchema/Protection');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateProtection {
  constructor({ ProtectionModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ProtectionModel = ProtectionModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async addProtection(data) {
    const schema = CreateProtectionSchema();

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

    const fields = Object.keys(data);
    const protection = new this.ProtectionModel();

    fields.forEach((field) => {
      protection[`${field}`] = data[`${field}`];
    });

    let result;
    try {
      result = await protection.save();
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
   * @returns
   */
  async returnProtectionById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const protection = await this.ProtectionModel.findOne({
      _id: new ObjectId(id),
    });

    if (!protection) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return protection;
  }

  /**
   *
   * @param {String} id
   * @returns
   */
  async returnActiveProtectionById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const protection = await this.ProtectionModel.findOne({
      _id: new ObjectId(id),
      deleted: false,
    });

    if (!protection) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return protection;
  }
}

module.exports = CreateProtection;
