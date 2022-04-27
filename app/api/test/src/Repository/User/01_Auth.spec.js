/* eslint-env jest */
const { authenticator } = require('otplib');

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
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('create user & sign in', async () => {
        const createUser = container.resolve('CreateUserRepository');
        const AuthUser = container.resolve('AuthRepository');

        const user = await createUser.addUser(
            'marys@gmail.com',
            'onCHGni7i7EfdF$@',
            ['SA'],
        );

        expect(
            await AuthUser.signIn({
                email: user.email,
                password: 'onCHGni7i7EfdF$@',
            }),
        ).toBeTruthy();

        await expect(
            AuthUser.signIn({
                email: 'fake@gmail.com',
                password: 'onCHGni7i7EfdF$@std',
            }),
        ).rejects.toThrowError();

        // login with otp
        const getUserSecret = user.otpSecret;
        const token = authenticator.generate(getUserSecret);

        expect(
            await AuthUser.signIn({
                email: user.email,
                otp: token,
            }),
        ).toBeTruthy();
    });
});
