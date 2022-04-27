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

        const UpstreamModel = container.resolve('UpstreamModel');
        await UpstreamModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    const sample = {
        name: 'testadvanced',
        advance: 1,
        advancedBody: `server backend1.example.com weight=5;
        server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
        server unix:/tmp/backend3;
        server backup1.example.com  backup;`,
    };
    const fakeId = '60d4f7712a117e43780a4888';

    it('edit upstream', async () => {
        const createUps = container.resolve('CreateUpstreamRepository');
        const editUps = container.resolve('EditUpstreamRepository');

        const up = await createUps.addUpstream(sample);

        expect(
            await editUps.updateUpstream({
                id: `${up.id}`,
                name: 'testadvanced2',
                advance: 1,
                advancedBody: `server backend1.example.com;`,
            }),
        ).toBeTruthy();

        // catch error
        await expect(editUps.updateUpstream({})).rejects.toThrowError();
        await expect(
            editUps.updateUpstream({
                id: fakeId,
                name: 'testadvanced2',
                advance: 1,
                advancedBody: `server backend1.example.com;`,
            }),
        ).rejects.toThrowError();
    });
});
