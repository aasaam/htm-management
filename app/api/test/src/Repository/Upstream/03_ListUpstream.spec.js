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

        const UpstreamModel = container.resolve('UpstreamModel');
        await UpstreamModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('add upstream and check list', async () => {
        const createUps = container.resolve('CreateUpstreamRepository');
        const listUpstream = container.resolve('ListUpstreamRepository');

        const sample = {
            name: 'testadvanced',
            advance: 1,
            advancedBody: `server backend1.example.com weight=5;
            server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
            server unix:/tmp/backend3;
            server backup1.example.com  backup;`,
        };

        await createUps.addUpstream(sample);

        const listDoc = await listUpstream.getUpstreamList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
