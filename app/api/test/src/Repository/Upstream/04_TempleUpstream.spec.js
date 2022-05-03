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

    it('temple', async () => {
        container.resolve('UpstreamTemplateRepository');
        const createUps = container.resolve('CreateUpstreamRepository');

        await createUps.addUpstream({
            advance: 1,
            name: 'upstreamjhtmple',
            advancedBody: `server backend1.example.com       weight=5;
    server backend2.example.com:8080;
    server unix:/tmp/backend3;

    server backup1.example.com:8080   backup;
    server backup2.example.com:8080   backup;
    `,
        });

        // await expect(upstrTemplate.renderAllUpstreamToFile()).resolves.toBe(
        //     undefined,
        // );
    });
});
