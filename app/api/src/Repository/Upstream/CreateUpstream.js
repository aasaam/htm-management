const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;

const { CreateUpstreamSchema } = require('../../JoySchema/Upstream');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class CreateUpstream {
  constructor({ UpstreamModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UpstreamModel = UpstreamModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async addUpstream(data) {
    const schema = CreateUpstreamSchema();

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

    const upstream = new this.UpstreamModel();

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

  /**
   *
   * @param {String} id
   * @returns{Promise<object>}
   */
  async returnUpstreamById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }

    const upstream = await this.UpstreamModel.findOne({
      _id: new ObjectId(id),
    });

    if (!upstream) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return upstream;
  }

  /**
   *
   * @param {String} id
   * @returns{Promise<object>}
   */
  async returnActiveUpstreamById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }

    const upstream = await this.UpstreamModel.findOne({
      _id: new ObjectId(id),
      deleted: false,
    });

    if (!upstream) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return upstream;
  }
}

module.exports = CreateUpstream;
