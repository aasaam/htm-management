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
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('read setting', async () => {
        const conf = container.resolve('GenerateAllRepository');
        const backup = container.resolve('CreateBackupRepository');

        // generate all data from collections. and write to file
        expect(await conf.generateAllConfFile()).toBe(true);

        // read all data from backup and make zip
        expect(await backup.makeZip()).toBeTruthy();
    });
});
