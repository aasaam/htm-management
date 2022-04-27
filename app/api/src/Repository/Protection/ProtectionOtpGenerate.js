const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ProtectionOtpGenerate {
  constructor({ ProtectionModel, ApplySettingRepository }) {
    /**
     * @private
     * @type {import('mongoose').Model}
     */
    this.ProtectionModel = ProtectionModel;
    this.ApplySetting = ApplySettingRepository;
  }

  async generateNewOtp() {
    const protection = new this.ProtectionModel();

    let otpSecret = null;
    otpSecret = await protection.setNewOtpSecret();
    if (!otpSecret) {
      throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
        statusCode: 500,
      });
    }

    // Update changeTime
    await this.ApplySetting.updateChangeTime();
    return otpSecret;
  }
}

module.exports = ProtectionOtpGenerate;
