/* eslint-disable security/detect-object-injection */
/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');
const Helper = require('../../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
    /** @type {import('awilix').AwilixContainer} */
    let container;
    /** @type {import('../../Helper/Helper')} */
    let helper;

    beforeAll(async () => {
        const config = new Config(ConfigSchema, {});
        container = await initContainer(config);
        helper = new Helper(container);

        const ServerModel = container.resolve('ServerModel');

        await ServerModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    // 1. list vh
    it('add vh and check list', async () => {
        const vhData = await helper.createAdvanceVh();
        const listVh = container.resolve('ListVhRepository');

        const listDoc = await listVh.getVhList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();

        // findSingleForRender
        const find = await listVh.findSingleForRender(vhData.id);
        expect(find).toBeTruthy();

        // findAllVhBackup
        const findAll = await listVh.findAllVhBackup();
        expect(findAll).toBeInstanceOf(Array);
    });
});
