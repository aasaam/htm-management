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

    it('edit user', async () => {
        const createUser = container.resolve('CreateUserRepository');
        const EditBySAUser = container.resolve('EditUserRepository');

        const user = await createUser.addUser(
            'heygoaway@gmail.com',
            'onCHGni7i7EfdF$@',
            ['VI'],
        );

        await expect(
            EditBySAUser.editUserBySuperadmin(),
        ).rejects.toThrowError();

        const res = await EditBySAUser.editUserBySuperadmin(
            user.id,
            'changed@gmail.com',
            ['SA'],
            true,
        );

        expect(res).toBeTruthy();

        // editUserByMember
        const res1 = await EditBySAUser.editUserByMember(
            user.id,
            'changedmember@gmail.com',
        );

        expect(res1).toBeTruthy();
        await expect(EditBySAUser.editUserByMember()).rejects.toThrowError();
    });
});
