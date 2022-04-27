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

    it('temple', async () => {
        const waf = container.resolve('WafTemplateRepository');
        const createWaf = container.resolve('CreateWafRepository');

        expect(
            await createWaf.addWafProfile('profilewaf3template', [
                {
                    name: 'imvalidwaftmp',
                    rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
                    description: 'need this for rules.',
                },
                {
                    name: 'imvalidnamer',
                    rule: 'BasicRule wl:1008 "mz:$URL_X:^/links|$ARGS_VAR_X:c"',
                    description: 'need this for rules.',
                },
            ]),
        ).toBeTruthy();

        await expect(waf.renderAllWafToFile()).resolves.toBe(undefined);
    });
});
