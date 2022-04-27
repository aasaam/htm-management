const { ObjectId } = require('mongoose').Types;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { CreateAclSchema } = require('../../JoySchema/Acl');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class CreateAcl {
  constructor({ AclModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.AclModel = AclModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {String} name
   * @param {String} mood
   * @param {Array} list
   * @returns {Promise<object>}
   */
  async addAcl(name, mood, list) {
    const input = {
      name,
      mood,
      list,
    };

    const schema = CreateAclSchema();

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

    const acl = new this.AclModel();

    acl.name = name;
    acl.mood = parseInt(mood, 10);

    const uniqList = [...new Set(list)];
    acl.list = uniqList;

    let result;
    try {
      result = await acl.save();
    } catch (e) {
      if (e) {
        MongooseErrorHandler(e);
      }
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
  async isAclProfileExistById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const acl = await this.AclModel.findOne({
      _id: new ObjectId(id),
    });

    return !!acl;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnActiveAclById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const acl = await this.AclModel.findOne({
      _id: new ObjectId(id),
      deleted: false,
    });

    if (!acl) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return acl;
  }

  /**
   *
   * @param {String} id
   * @returns {Promise<object>}
   */
  async returnAclById(id) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const acl = await this.AclModel.findOne({
      _id: new ObjectId(id),
    });

    if (!acl) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    return acl;
  }
}

module.exports = CreateAcl;
