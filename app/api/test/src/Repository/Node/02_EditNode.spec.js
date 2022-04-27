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
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('add node and edit that', async () => {
        const createNode = container.resolve('CreateNodeRepository');
        const editNode = container.resolve('EditNodeRepository');

        const res = await createNode.addNode(
            '192.168.0.3',
            'bnh5yzdirjinqaorq0ox1tf383nb3xr',
            'legacy',
            '9091',
            'asd.com',
        );

        expect(
            await editNode.updateNode(
                res.id,
                '192.168.0.8',
                'bnh5yzdirjinqaorq0ox1tf383nb3x',
                'intermediate',
                '1080',
                'asd.com',
            ),
        ).toEqual(res.id);
    });

    it('add node and edit that', async () => {
        const createNode = container.resolve('CreateNodeRepository');
        const editNode = container.resolve('EditNodeRepository');
        const ipTest = '192.168.0.7';
        const res = await createNode.addNode(
            ipTest,
            'bnh5yzdirjinqaorq0ox1tf383nb3xr',
            'intermediate',
            '1081',
            'asda.com',
        );

        await expect(
            editNode.updateNode(res.id, '192.168.0', 'a1s2d3ffgg', '10'),
        ).rejects.toThrowError();
        await expect(editNode.updateNode()).rejects.toThrowError();

        await expect(
            editNode.updateNode(
                '60be22b6e16cef0adde58940',
                '192.168.0.4',
                'bnh5yzdirjinqaorq0ox1tf383nb3xr',
                'intermediate',
                '1081',
                'asd.com',
            ),
        ).rejects.toThrowError();
    });
});
