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

        const SettingModel = container.resolve('SettingModel');
        await SettingModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('apply config', async () => {
        const res = container.resolve('ApplySettingRepository');

        const initConf = await res.initializeTimeConfig();
        expect(initConf).toBe(true);

        // getSettingStatus
        const changeTime = await res.getSettingStatus('changeTime');

        expect(changeTime).toBeInstanceOf(Date);

        // updateLastApplyTime
        await res.updateLastApplyTime();
        await res.updateChangeTime();
    });
});
