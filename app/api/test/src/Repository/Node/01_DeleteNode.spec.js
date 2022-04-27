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

        const NodeModel = container.resolve('NodeModel');
        await NodeModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('add node and delete that', async () => {
        const createNode = container.resolve('CreateNodeRepository');
        const deleteNode = container.resolve('DeleteNodeRepository');

        await createNode.addNode(
            '192.168.0.7',
            'bnh5yzdirjinqaorq0ox1tf383nb3xr',
            'legacy',
            '1080',
            'asd.com',
        );

        const NodeId = await createNode.findNodeByIp('192.168.0.7');
        await expect(deleteNode.removeNode('a1s2d3f4')).rejects.toThrowError();
        expect(await deleteNode.removeNode(NodeId)).toEqual(NodeId);
    });

    it('capture delete node error wrong id', async () => {
        const deleteNode = container.resolve('DeleteNodeRepository');

        await expect(
            deleteNode.removeNode('60c282c9a5868f046bb4c5d0'),
        ).rejects.toThrowError();
    });

    it('capture delete node error no id', async () => {
        const deleteNode = container.resolve('DeleteNodeRepository');
        await expect(deleteNode.removeNode()).rejects.toThrowError();
    });
});
