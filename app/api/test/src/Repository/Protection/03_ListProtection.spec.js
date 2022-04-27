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

    it('add protection and check list', async () => {
        const createProfile = container.resolve('CreateProtectionRepository');
        const ListProtection = container.resolve('ListProtectionRepository');
        const sample = {
            name: 'testplist',
            country: ['JP', 'US'],
            asnRange: ['32934-32935'],
            clientToken: {
                ' token-timePro': 'cnhvYXczaGZ6YTk6dGF4Znlo',
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

        const listDoc = await ListProtection.getProtectionList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
