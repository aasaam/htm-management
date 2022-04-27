/* eslint-disable security/detect-object-injection */
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

        const WafModel = container.resolve('WafModel');
        await WafModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    // 1. list acl
    it('add node and check list', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        const listWaf = container.resolve('ListWafRepository');

        await createWaf.addWafProfile('profilewaf3docs', [
            {
                name: 'imvalidwaflist',
                rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
                description: 'need this for rules.',
            },
        ]);

        const listDoc = await listWaf.getWafList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
