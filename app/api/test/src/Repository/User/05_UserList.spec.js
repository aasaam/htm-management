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

    it('user list', async () => {
        const ListUser = container.resolve('ListUserRepository');
        const createUser = container.resolve('CreateUserRepository');

        expect(
            await createUser.addUser('mary@gmail.com', 'onCHGni7i7EfdF$@', [
                'SA',
            ]),
        ).toBeTruthy();
        expect(
            await createUser.addUser('sanaz@gmail.com', 'onCHGni7i7EfdF$@', [
                'AD',
            ]),
        ).toBeTruthy();

        const listDoc = await ListUser.getAllUserList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
