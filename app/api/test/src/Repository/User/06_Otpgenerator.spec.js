/* eslint-disable sonarjs/no-duplicate-string */
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

    it('otp generate for user profile', async () => {
        const OtpGenerator = container.resolve('OtpGeneratorRepository');
        const createUser = container.resolve('CreateUserRepository');

        const u = await createUser.addUser(
            'ineedotptnx@gmail.com',
            'onCHGni7i7EfdF$@',
            ['SA'],
        );

        expect(
            await OtpGenerator.generateNewOtpSecret({
                id: u.id,
                currentPassword: 'onCHGni7i7EfdF$@',
            }),
        ).toBeTruthy();

        await expect(
            OtpGenerator.generateNewOtpSecret({}),
        ).rejects.toThrowError();

        await expect(
            OtpGenerator.generateNewOtpSecret({
                id: '60d4f7712a117e43780a8888',
                currentPassword: 'onCHGni7i7EfdF$@',
            }),
        ).rejects.toThrowError();

        await expect(
            OtpGenerator.generateNewOtpSecret({
                id: u.id,
                currentPassword: 'onCHGni7i7Ef',
            }),
        ).rejects.toThrowError();
    });
});
