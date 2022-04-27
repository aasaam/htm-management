const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { UpdateProtectionSchema } = require('../../JoySchema/Protection');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class EditProtection {
  constructor({ ProtectionModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ProtectionModel = ProtectionModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async updateProtection(data) {
    const schema = UpdateProtectionSchema();

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

    const protection = await this.ProtectionModel.findById(data.id);

    if (!protection) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    const fields = Object.keys(data);

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

    return result.id;
  }
}

module.exports = EditProtection;
