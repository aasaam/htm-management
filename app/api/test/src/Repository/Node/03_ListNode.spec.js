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

    // 1. list node
    it('add node and check list', async () => {
        const createNode = container.resolve('CreateNodeRepository');
        const listNode = container.resolve('ListNodeRepository');

        await createNode.addNode(
            '192.168.0.3',
            'bnh5yzdirjinqaorq0ox1tf383nb3xr',
            'legacy',
            '9091',
            'asd.com',
        );
        const listDoc = await listNode.getNodeList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
