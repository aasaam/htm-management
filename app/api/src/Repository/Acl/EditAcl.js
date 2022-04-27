/* eslint-disable eqeqeq */

const { ObjectId } = require('mongoose').Types;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { UpdateAclSchema } = require('../../JoySchema/Acl');
const MongooseErrorHandler = require('../../Utils/MongooseErrorHandler');

class EditAcl {
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
   * @param {*} id
   * @param {*} name
   * @param {*} mood
   * @param {*} list
   * @returns
   */
  async updateAcl(id, name, mood, list, deleted) {
    const input = {
      id,
      name,
      mood,
      list,
      deleted,
    };

    const schema = UpdateAclSchema();
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

    const acl = await this.AclModel.findOne({
      _id: new ObjectId(id),
    });

    if (!acl) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    acl.name = name;
    acl.mood = parseInt(mood, 10);

    const uniqList = [...new Set(list)];
    acl.list = uniqList;
    acl.deleted = deleted;
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
    return result.id;
  }
}

module.exports = EditAcl;
