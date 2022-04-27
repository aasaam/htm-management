class ApplySetting {
  constructor({ SettingModel }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.SettingModel = SettingModel;
  }

  /**
   *
   * @returns {Promise<boolean>}
   */
  async initializeTimeConfig() {
    let success = true;
    const allConfig = await this.SettingModel.findOne({});
    if (!allConfig) {
      const setting = await new this.SettingModel();
      setting.changeTime = Date.UTC(1, 1, 1, 1, 1, 1);
      setting.lastApplyTime = Date.UTC(0, 0, 0, 0, 0, 0);
      try {
        await setting.save();
      } catch (error) {
        success = false;
        throw new Error(`${error}`);
      }
    } else {
      allConfig.changeTime = Date.UTC(1, 1, 1, 1, 1, 1);
      allConfig.lastApplyTime = Date.UTC(0, 0, 0, 0, 0, 0);

      try {
        await allConfig.save();
      } catch (error) {
        success = false;
        throw new Error(`${error}`);
      }
    }

    return success;
  }

  async getSettingStatus(name) {
    const allConfig = await this.SettingModel.findOne({});
    return allConfig[`${name}`];
  }

  async updateChangeTime() {
    const setting = await this.SettingModel.findOne({});
    setting.changeTime = new Date();
    await setting.save();
  }

  async updateLastApplyTime() {
    const setting = await this.SettingModel.findOne({});
    const resetBoth = new Date();
    setting.changeTime = resetBoth;
    setting.lastApplyTime = resetBoth;
    await setting.save();
  }
}

module.exports = ApplySetting;
