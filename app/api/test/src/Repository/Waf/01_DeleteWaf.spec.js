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

        const WafModel = container.resolve('WafModel');
        await WafModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    // 1. delete waf profile error
    it('delete waf profile error no id', async () => {
        const deleteWaf = container.resolve('DeleteWafRepository');

        await expect(deleteWaf.removeWaf()).rejects.toThrowError();
    });

    // 2.delete waf profile
    it('delete waf profile', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        const deleteWaf = container.resolve('DeleteWafRepository');

        const w = await createWaf.addWafProfile('profilewaf4', [
            {
                name: 'wafpro1',
                rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
                description: 'need this for rules.',
            },
        ]);

        expect(await deleteWaf.removeWaf(w.id)).toBeTruthy();
    });

    // 3.delete waf profile
    it('delete waf profile error', async () => {
        const deleteWaf = container.resolve('DeleteWafRepository');

        await expect(
            deleteWaf.removeWaf('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
    });
});
