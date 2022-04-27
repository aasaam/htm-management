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

        const NodeModel = container.resolve('NodeModel');
        await NodeModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('add node', async () => {
        const createNode = container.resolve('CreateNodeRepository');

        expect(
            await createNode.addNode(
                '192.168.0.1',
                'bnh5yzdirjinqaorq0ox1tf383nb3xr',
                'modern',
                '9091',
                'asd.com',
            ),
        ).toBeTruthy();

        await expect(createNode.addNode()).rejects.toThrowError();

        await expect(
            createNode.addNode(
                '192.168.0.2',
                'bnh5yzdirjinqaorq0ox1tf383nb3',
                'modern',
                '9091',
                'asd.com',
            ),
        ).rejects.toThrowError();
    });

    it('find node by ip', async () => {
        const ip = '192.168.0.1';
        const createNode = container.resolve('CreateNodeRepository');
        const NodeId = await createNode.findNodeByIp(ip);

        // -----findNodeByIp-----
        expect(await createNode.findNodeByIp(ip)).toBeTruthy();
        await expect(
            createNode.findNodeByIp('127.0.0.58'),
        ).rejects.toThrowError();

        await expect(createNode.findNodeByIp('')).rejects.toThrowError();

        // -----returnNodeById-----
        await expect(createNode.returnNodeById('')).rejects.toThrowError();
        expect(await createNode.returnNodeById(NodeId)).toBeTruthy();
        await expect(
            createNode.returnNodeById('60be22b6e16cef0adde58940'),
        ).rejects.toThrowError();
    });
});
