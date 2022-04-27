/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');

const commonFakeVars = {
    password: 'onCHGni7i7EfdsF$@s',
};

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

    const fakeId = '60d4f7712a117e43780a4888';

    it('add superadmin user', async () => {
        const createUser = container.resolve('CreateUserRepository');

        expect(
            await createUser.addUser(
                'artmary.ir@gmail.com',
                commonFakeVars.password,
                ['SA'],
            ),
        ).toBeTruthy();

        // duplicate
        await expect(
            createUser.addUser(
                'artmary.ir@gmail.com',
                commonFakeVars.password,
                ['VI'],
            ),
        ).rejects.toThrowError();
    });

    it('exist', async () => {
        const userExist = container.resolve('CreateUserRepository');
        const testuser = await userExist.addUser(
            'snapp@gmail.com',
            commonFakeVars.password,
            ['VI'],
        );

        expect(
            await userExist.isUserExist({ email: 'noemailexist@local' }),
        ).toBeFalsy();

        expect(
            await userExist.isUserExist({ email: testuser.email }),
        ).toBeTruthy();

        await expect(userExist.isUserExist({})).rejects.toThrowError();

        expect(
            await userExist.isUserExist({
                email: 'nofuckingusername',
            }),
        ).toBeFalsy();

        // // ReturnUserExistById
        expect(await userExist.ReturnUserExistById(testuser.id)).toBeTruthy();
        await expect(userExist.ReturnUserExistById()).rejects.toThrowError();
        await expect(
            userExist.ReturnUserExistById(fakeId),
        ).rejects.toThrowError();

        // getUserId
        expect(
            await userExist.getUserId({
                email: testuser.email,
            }),
        ).toEqual(testuser.id);

        // generatePasswordAndSet
        const newUser = await userExist.generatePasswordAndSet(testuser.email);
        expect(newUser).toBeTruthy();
    });

    it('User generateStrongPassword', async () => {
        const genPass = container.resolve('CreateUserRepository');

        expect(await genPass.generateStrongPassword()).toBeTruthy();
    });
});
