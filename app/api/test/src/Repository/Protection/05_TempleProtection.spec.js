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

        const ProtectionModel = container.resolve('ProtectionModel');
        await ProtectionModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('temple', async () => {
        const protection = container.resolve('ProtectionTemplateRepository');
        const createProfile = container.resolve('CreateProtectionRepository');
        const sample = {
            name: 'testp',
            country: ['JP', 'US'],
            cidr: ['192.168.0.0/23'],
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
        await createProfile.addProtection(sample);

        await expect(protection.renderAllProtectionToFile()).resolves.toBe(
            undefined,
        );
    });
});
