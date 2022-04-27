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
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('acl profile error no params', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        await expect(createAcl.addAcl()).rejects.toThrowError();
    });

    it('add acl profile', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        expect(
            await createAcl.addAcl('profile1', 0, ['10.0.0.0/9', '172.16.0.0']),
        ).toBeTruthy();
    });

    it('duplicate name error', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        await expect(
            createAcl.addAcl('profile1', 1, ['127.0.0.6']),
        ).rejects.toThrowError();
    });

    it('add acl profile', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        expect(
            await createAcl.addAcl('profile2x', 1, [
                '10.0.0.0/4',
                '172.16.0.0',
            ]),
        ).toBeTruthy();
    });

    it('acl profile error invalid name', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        await expect(
            createAcl.addAcl('++', 1, ['10.0.0.0/8']),
        ).rejects.toThrowError();
    });

    it('acl profile error invalid mood', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        await expect(
            createAcl.addAcl('invalidmood', 5, ['10.0.0.0/8']),
        ).rejects.toThrowError();
    });

    it('isAclProfileExistById', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        const data = await createAcl.addAcl('imexistornot', 0, ['10.0.0.0/2']);
        const res = await createAcl.isAclProfileExistById(data.id);
        const res2 = await createAcl.returnAclById(data.id);

        expect(res).toBeTruthy();
        expect(res2).toBeTruthy();
    });

    it('error isAclProfileExistById', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        await expect(createAcl.isAclProfileExistById()).rejects.toThrowError();
    });

    it('error bad input', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        await expect(createAcl.returnAclById()).rejects.toThrowError();
    });

    it('error isAclProfileExistById', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        const res = await createAcl.isAclProfileExistById(
            '60d4f7712a117e43780a4888',
        );

        expect(res).toBeFalsy();

        await expect(
            createAcl.returnAclById('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
    });

    it('error returnActiveAclById', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        await expect(
            createAcl.returnActiveAclById('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
    });

    it('error returnActiveAclById no id', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        await expect(createAcl.returnActiveAclById()).rejects.toThrowError();
    });

    it('success  returnActiveAclById', async () => {
        const createAcl = container.resolve('CreateAclRepository');

        const data = await createAcl.addAcl('successreturn', 0, ['10.0.0.0/2']);
        const res = await createAcl.returnActiveAclById(data.id);
        expect(res.name).toBe('successreturn');
    });
});
