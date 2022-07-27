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
    // eslint-disable-next-line no-unused-vars
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
    it('check list', async () => {
        // const vhData = await helper.createAdvanceVh();
        const vh = container.resolve('BulkUpdateVhRepository');

        const listDoc = await vh.findVHbyDomain('star.com');
        console.log(listDoc);
        // const update = await vh.bulkUpdateVh({
        //     domain: 'star.com',
        //     certId: '62dfae47b9a21cc6a03a9fea',
        // });
    });
});
