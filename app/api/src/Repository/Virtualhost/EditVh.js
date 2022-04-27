const { ErrorWithProps } = require('mercurius').default;

const { UpdateVirtualhostSchema } = require('../../JoySchema/Virtualhost');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class EditVh {
  constructor({ ServerModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ServerModel = ServerModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async updateVh(data) {
    const schema = UpdateVirtualhostSchema();

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

    const server = await this.ServerModel.findById(data.id);

    if (!server) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

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
}

module.exports = EditVh;
