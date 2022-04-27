const { ObjectId } = require('mongoose').Types;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { UpdateMemberPassword: userJoiSchema } = require('../../JoySchema/User');

/**
 * @description update user password while user is logged in
 */

class UpdatePassword {
  constructor({ UserModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.UserModel = UserModel;
  }

  /**
   *
   * @param {*} id
   * @param {*} currentPassword
   * @param {*} newPassword
   * @param {*} admin
   * @returns
   */
  async updateUserCurrentPassword(
    id,
    currentPassword,
    newPassword,
    admin = false,
  ) {
    const input = {
      id,
      currentPassword,
      newPassword,
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

    const user = await this.UserModel.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    let result = false;

    // If user is admin, then we don't need to enter current password
    if (admin) {
      await user.setPassword(newPassword);
      await user.save();
      result = true;
    } else {
      const isValidCurrentPass = await user.verifyPassword(currentPassword);
      if (!isValidCurrentPass) {
        throw new ErrorWithProps(errorConstMerge.NOT_MATCH_PASSWORD, {
          statusCode: 422,
        });
      }
      await user.setPassword(newPassword);
      await user.save();
      result = true;
    }
    return result;
  }
}

module.exports = UpdatePassword;
