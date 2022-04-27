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

        const AclModel = container.resolve('AclModel');
        await AclModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('generate acl template and write to file', async () => {
        const acl = container.resolve('AclTemplateRepository');
        const createAcl = container.resolve('CreateAclRepository');
        expect(
            await createAcl.addAcl('profileacltemplatetest', 0, [
                '10.0.0.0/9',
                '172.16.0.0',
            ]),
        ).toBeTruthy();

        await expect(acl.renderAllAclToFile()).resolves.toBe(undefined);
    });
});
