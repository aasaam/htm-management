/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
    /** @type {import('awilix').AwilixContainer} */
    let container;

    beforeAll(async () => {
        const config = new Config(ConfigSchema, {});
        container = await initContainer(config);
        const setting = container.resolve('ActionSettingRepository');
        const conf = container.resolve('ApplySettingRepository');
        await setting.initNginxConf();
        await conf.initializeTimeConfig();

        const ProtectionModel = container.resolve('ProtectionModel');
        await ProtectionModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    // 1. generate otp secret
    it('generate otp secret protection', async () => {
        const otpG = container.resolve('ProtectionOtpGenerateRepository');

        await expect(otpG.generateNewOtp()).toBeTruthy();
    });
});
