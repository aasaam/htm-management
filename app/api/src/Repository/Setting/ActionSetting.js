/* eslint-disable security/detect-non-literal-fs-filename */

const fs = require('fs').promises;
const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ActionSetting {
  constructor({ SettingModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.SettingModel = SettingModel;
    this.ApplySetting = ApplySettingRepository;
  }

  /**
   *
   * @param {string} name
   * @returns
   */
  async getNginxConf(name) {
    const config = await this.SettingModel.findOne({});
    return config[`${name}`];
  }

  /**
   *
   * @param {string} field
   * @param {string} value
   */
  async findConfigAndUpdate(field, value) {
    if (!value || !field) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 400,
      });
    }

    const config = await this.SettingModel.findOne({});

    config.nginxconf = value;
    await config.save();
    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return config.id;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async initNginxConf() {
    const config = await this.SettingModel.findOne({});

    let file = null;
    let success = true;
    try {
      file = await fs.readFile('/app/api/src/Repository/Setting/nginx.txt');
    } catch (error) {
      success = false;
      throw new Error(`${error}`);
    }

    if (!config) {
      const setting = await new this.SettingModel({});
      setting.nginxconf = file.toString();
      await setting.save();
    } else {
      config.nginxconf = file.toString();
      await config.save();
    }

    return success;
  }

  /**
   *
   * @returns {Promise<string>}
   */
  async findAllSettingBackup() {
    return this.SettingModel.find({});
  }

  async rmSettingCollection() {
    return this.SettingModel.deleteMany({});
  }

  async insertSettingCollection(setting) {
    await this.SettingModel.insertMany(setting, { ordered: false });
  }
}

module.exports = ActionSetting;
