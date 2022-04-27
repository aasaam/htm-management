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

    // 1. add vh & delete
    it('delete vh', async () => {
        const vhData = await helper.createAdvanceVh();

        const delVh = container.resolve('DeleteVhRepository');

        const deletedId = await delVh.removeVh(vhData.id);
        expect(deletedId).toEqual(vhData.id);

        // error no id
        await expect(delVh.removeVh()).rejects.toThrowError();
    });
});
