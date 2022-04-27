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

    it('acl edit error no id params', async () => {
        const editAcl = container.resolve('EditAclRepository');

        await expect(editAcl.updateAcl()).rejects.toThrowError();
    });

    it('acl edit error fake id params', async () => {
        const editAcl = container.resolve('EditAclRepository');

        await expect(
            editAcl.updateAcl('60d4f7712a117e43780a4888', 'profile1', 0, [
                '173.16.0.2',
            ]),
        ).rejects.toThrowError();
    });

    // 2. edit acl profile
    it('edit acl profile', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        const editAcl = container.resolve('EditAclRepository');

        const acl = await createAcl.addAcl('profile2edit', 1, [
            '10.0.0.0/5',
            '173.16.0.2',
        ]);
        expect(
            await editAcl.updateAcl(acl.id, 'wannachangeacl', 0, [
                '10.0.0.0/4',
                '172.16.0.0',
            ]),
        ).toBeTruthy();
    });

    // 3. edit acl profile
    it('error edit acl profile name', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        const editAcl = container.resolve('EditAclRepository');

        const acl = await createAcl.addAcl('profile3edit', 1, [
            '10.0.0.0/9',
            '172.16.0.2',
        ]);

        await expect(
            editAcl.updateAcl(acl.id, '+q', null, null),
        ).rejects.toThrowError();
    });

    // 4. edit acl profile
    it('error edit acl profile mood', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        const editAcl = container.resolve('EditAclRepository');

        const acl = await createAcl.addAcl('profile4edit', 1, [
            '10.0.0.0/9',
            '172.16.0.2',
        ]);

        await expect(
            editAcl.updateAcl(acl.id, null, 6, null),
        ).rejects.toThrowError();
    });
});
