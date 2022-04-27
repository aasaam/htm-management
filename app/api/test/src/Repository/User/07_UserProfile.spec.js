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

        const UserModel = container.resolve('UserModel');
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    // 1. user profile
    it('user profile', async () => {
        const profile = container.resolve('ProfileUserRepository');
        const createUser = container.resolve('CreateUserRepository');

        const u = await createUser.addUser(
            'imaprofile@gmail.com',
            'onCHGni7i7EfsdF$@',
            ['SA'],
        );

        expect(await profile.profileUserData(u.id)).toBeTruthy();

        await expect(profile.profileUserData()).rejects.toThrowError();

        await expect(
            profile.profileUserData('60d4f7712a117e43780a8888'),
        ).rejects.toThrowError();
    });
});
