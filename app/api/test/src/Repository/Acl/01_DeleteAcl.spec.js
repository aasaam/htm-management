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

        const setting = container.resolve('ActionSettingRepository');
        const conf = container.resolve('ApplySettingRepository');
        await setting.initNginxConf();
        await conf.initializeTimeConfig();

        const AclModel = container.resolve('AclModel');
        await AclModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    // 1. delete acl profile error
    it('delete acl profile error no id', async () => {
        const deleteAcl = container.resolve('DeleteAclRepository');

        await expect(deleteAcl.removeAcl()).rejects.toThrowError();
    });

    // 2.delete acl profile
    it('delete acl profile', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        const deleteAcl = container.resolve('DeleteAclRepository');

        const acl = await createAcl.addAcl('gonnabedel', 0, [
            '10.0.0.0/9',
            '172.16.0.0',
        ]);

        expect(await deleteAcl.removeAcl(acl.id)).toBeTruthy();
    });

    // 3.delete acl profile
    it('delete acl profile error', async () => {
        const deleteAcl = container.resolve('DeleteAclRepository');

        await expect(
            deleteAcl.removeAcl('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
    });
});
