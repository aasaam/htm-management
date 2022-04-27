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

    it('delete user by id', async () => {
        const DelUser = container.resolve('DeleteUserRepository');
        const createUser = container.resolve('CreateUserRepository');

        const user = await createUser.addUser(
            'removeuser@gmail.com',
            'onCHGni7i7EfdF$@',
            ['VI'],
        );

        await expect(DelUser.removeUserById()).rejects.toThrowError();
        const deletedUser = await DelUser.removeUserById(user.id);
        expect(deletedUser.deleted).toBeTruthy();
    });
});
