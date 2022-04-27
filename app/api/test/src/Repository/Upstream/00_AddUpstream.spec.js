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
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    const sample3 = {
        name: 'testadvanced',
        advance: 1,
        advancedBody: `server backend1.example.com weight=5;
        server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
        server unix:/tmp/backend3;
        server backup1.example.com  backup;`,
    };

    const sample2 = {
        name: 'testmultipleserver',
        advance: 0,
        serverList: [
            {
                server: '128.0.0.6',
                port: '80',
            },
            {
                server: '127.0.0.1',
                port: '8081',
                weight: 5,
                backup: true,
            },
        ],
        loadBalanceMethod: 'HI',
    };
    const sample1 = {
        name: 'testup',
        advance: 0,
        serverList: [
            {
                server: '127.0.0.1',
                port: '8080',
            },
        ],
    };
    const fakeId = '60d4f7712a117e43780a4888';

    it('add upstream', async () => {
        const createUps = container.resolve('CreateUpstreamRepository');
        expect(await createUps.addUpstream(sample1)).toBeTruthy();
        expect(await createUps.addUpstream(sample2)).toBeTruthy();
    });

    it('add upstream catch error', async () => {
        const createUps = container.resolve('CreateUpstreamRepository');
        await expect(createUps.addUpstream()).rejects.toThrowError();

        await expect(
            createUps.addUpstream({
                name: 'testuperror',
            }),
        ).rejects.toThrowError();

        await expect(
            createUps.addUpstream({
                name: 'testuperror',
                advance: 1,
            }),
        ).rejects.toThrowError();
    });

    it('return upstream', async () => {
        const createUps = container.resolve('CreateUpstreamRepository');
        const res = await createUps.addUpstream(sample3);

        // returnUpstreamById
        expect(await createUps.returnUpstreamById(res.id)).toBeTruthy();
        await expect(createUps.returnUpstreamById()).rejects.toThrowError();
        await expect(
            createUps.returnUpstreamById(fakeId),
        ).rejects.toThrowError();

        // returnActiveUpstreamById
        expect(await createUps.returnActiveUpstreamById(res.id)).toBeTruthy();
        await expect(
            createUps.returnActiveUpstreamById(),
        ).rejects.toThrowError();
        await expect(
            createUps.returnActiveUpstreamById(fakeId),
        ).rejects.toThrowError();
    });
});
