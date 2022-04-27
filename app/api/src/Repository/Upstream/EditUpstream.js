const { ErrorWithProps } = require('mercurius').default;

const { UpdateUpstreamSchema } = require('../../JoySchema/Upstream');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class EditUpstream {
  constructor({ UpstreamModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UpstreamModel = UpstreamModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async updateUpstream(data) {
    const schema = UpdateUpstreamSchema();

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

    const upstream = await this.UpstreamModel.findById(data.id);

    if (!upstream) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    const fields = Object.keys(data);
    fields.forEach((field) => {
      upstream[`${field}`] = data[`${field}`];
    });

    let result;
    try {
      result = await upstream.save();
    } catch (error) {
      MongooseErrorHandler(error);
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return result;
  }
}

module.exports = EditUpstream;
