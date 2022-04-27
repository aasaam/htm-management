const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { UpdateWafSchema } = require('../../JoySchema/Waf');

class EditWaf {
  constructor({ WafModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.WafModel = WafModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async updateWaf({ id, profileName, list, deleted }) {
    const schema = UpdateWafSchema();

    try {
      await schema.validateAsync(
        {
          id,
          profileName,
          list,
          deleted,
        },
        {
          abortEarly: false,
        },
      );
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

    const waf = await this.WafModel.findById(id);

    waf.profileName = profileName;
    waf.list = list;
    waf.deleted = deleted;
    await waf.save();

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return waf.id;
  }
}

module.exports = EditWaf;
