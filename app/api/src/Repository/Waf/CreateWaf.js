const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { CreateWafSchema } = require('../../JoySchema/Waf');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateWaf {
  constructor({ WafModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.WafModel = WafModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {*} profileName
   * @param {*} list
   * @returns {Promise<object>}
   */
  async addWafProfile(profileName, list) {
    const input = {
      profileName,
      list,
    };

    const schema = CreateWafSchema();

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

    const waf = new this.WafModel();

    waf.profileName = profileName;
    waf.list = list;

    let result;

    try {
      result = await waf.save();
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
  async isWafProfileExistById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }

    const waf = await this.WafModel.findOne({
      _id: new ObjectId(id),
    });

    return !!waf;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnActiveWafById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const waf = await this.WafModel.findOne({
      _id: new ObjectId(id),
      deleted: false,
    });

    if (!waf) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return waf;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnWafById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 422,
      });
    }
    const waf = await this.WafModel.findOne({
      _id: new ObjectId(id),
    });

    if (!waf) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return waf;
  }
}

module.exports = CreateWaf;
