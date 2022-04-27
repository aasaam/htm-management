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
        const setting = container.resolve('ActionSettingRepository');
        const conf = container.resolve('ApplySettingRepository');
        await setting.initNginxConf();
        await conf.initializeTimeConfig();

        const ProtectionModel = container.resolve('ProtectionModel');
        await ProtectionModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('add protection', async () => {
        const createProfile = container.resolve('CreateProtectionRepository');
        const sample = {
            name: 'testp',
            country: ['JP', 'US'],
            cidr: ['192.168.0.0/23'],
            asn: ['32934', '32935'],
            asnRange: ['32934-32935'],
            clientToken: {
                'token-timePro': 'cnhvYXczaGZ6YTk6dGF4Znlo',
            },
            protectionDefaultLang: 'fa',
            protectionSupportedLang: ['en', 'fa'],
            protectionI18nOrgTitle: {
                en: 'testp',
                fa: 'تست یک',
            },
            protectionConfigTtl: '3600',
            protectionConfigTimeout: '300',
            protectionConfigWaitToSolve: '180',
            challenge: 'js',
            captchaDifficulty: 'hard',
        };

        await expect(
            createProfile.addProtection({
                name: 'test3',
                country: 123,
            }),
        ).rejects.toThrowError();

        const res = await createProfile.addProtection(sample);
        expect(res).toBeTruthy();

        await expect(
            createProfile.addProtection(sample),
        ).rejects.toThrowError();

        // returnProtectionById
        await expect(
            createProfile.returnProtectionById(),
        ).rejects.toThrowError();
        await expect(
            createProfile.returnProtectionById('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();

        expect(await createProfile.returnProtectionById(res.id)).toBeTruthy();

        // returnActiveProtectionById
        await expect(
            createProfile.returnActiveProtectionById(),
        ).rejects.toThrowError();
        await expect(
            createProfile.returnActiveProtectionById(
                '60d4f7712a117e43780a4888',
            ),
        ).rejects.toThrowError();

        expect(
            await createProfile.returnActiveProtectionById(res.id),
        ).toBeTruthy();
    });
});
