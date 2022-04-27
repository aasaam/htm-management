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

    it('create user & send code', async () => {
        const fp = container.resolve('ForgotPasswordUserRepository');
        const createUser = container.resolve('CreateUserRepository');

        const user = await createUser.addUser(
            'artmary.ir@gmail.com',
            'onCHGni7i7EfdF$@',
            ['SA'],
            true,
        );

        const a = await fp.sendForgotPasswordCode(user.email);
        expect(a).toBeTruthy();
    });
});
