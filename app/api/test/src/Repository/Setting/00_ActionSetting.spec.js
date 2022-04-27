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

        const SettingModel = container.resolve('SettingModel');
        await SettingModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('nginx config', async () => {
        const res = container.resolve('ActionSettingRepository');

        const initConf = await res.initNginxConf();
        expect(initConf).toBe(true);

        // getNginxConf
        expect(res.getNginxConf('nginxconf')).toBeTruthy();

        // findConfigAndUpdate
        const updateConf = await res.findConfigAndUpdate(
            'nginxconf',
            'i will broke the nginx config',
        );

        await expect(res.findConfigAndUpdate()).rejects.toThrowError();

        expect(updateConf).toBeTruthy();
        const newRes = await res.getNginxConf('nginxconf');

        expect(newRes).toBe('i will broke the nginx config');
    });
});
