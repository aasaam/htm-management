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

    it('edit protection', async () => {
        const createProfile = container.resolve('CreateProtectionRepository');
        const editProfile = container.resolve('EditProtectionRepository');
        const sample = {
            name: 'testpedit',
            country: ['JP', 'US'],
            protectionDefaultLang: 'fa',
            protectionSupportedLang: ['en', 'fa'],
            protectionI18nOrgTitle: {
                en: 'testp',
                fa: 'تست یک',
            },
            protectionConfigTtl: '3600',
            protectionConfigTimeout: '300',
            protectionConfigWaitToSolve: '180',
            challenge: 'ldap',
            captchaDifficulty: 'easy',
            ldapUri: 'ldap://ldap.example.com',
            ldapRoUsername: 'cn=admin,dc=example,dc=com',
            ldapRoPassword: 'admin',
            ldapBaseDn: 'dc=example,dc=com',
            ldapFilter: '(uid={{username}})',
            ldapAttributes: [''],
        };

        const profile = await createProfile.addProtection(sample);

        expect(
            await editProfile.updateProtection({
                id: `${profile.id}`,
                name: 'testpedit',
                country: ['SG'],
                protectionDefaultLang: 'en',
                protectionSupportedLang: ['en', 'fa'],
                protectionI18nOrgTitle: {
                    en: 'changeorg',
                    fa: 'یک تغییر شده',
                },
                protectionConfigTtl: '3600',
                protectionConfigTimeout: '300',
                protectionConfigWaitToSolve: '180',
                challenge: 'ldap',
                captchaDifficulty: 'easy',
                ldapUri: 'ldap://ldap.example.com',
                ldapRoUsername: 'cn=admin,dc=example,dc=com',
                ldapRoPassword: 'adminedited',
                ldapBaseDn: 'dc=example,dc=com',
                ldapFilter: '(uid={{username}})',
                ldapAttributes: [''],
            }),
        ).toBeTruthy();

        // error
        await expect(
            editProfile.updateProtection({
                id: `${profile.id}`,
                name: 'testpedit',
                country: ['SG'],
                protectionDefaultLang: 'en',
                protectionSupportedLang: ['en', 'fa'],
                protectionI18nOrgTitle: {
                    en: 'changeorg',
                    fa: 'یک تغییر شده',
                },
                protectionConfigTtl: 'aa',
                protectionConfigTimeout: '300',
                protectionConfigWaitToSolve: '180',
                challenge: 'notachallange',
                captchaDifficulty: 'easy',
                ldapUri: 'ldap://ldap.example.com',
                ldapRoUsername: 'cn=admin,dc=example,dc=com',
                ldapRoPassword: 'adminedited',
                ldapBaseDn: 'dc=example,dc=com',
                ldapFilter: '(uid={{username}})',
                ldapAttributes: [''],
            }),
        ).rejects.toThrowError();

        // error fake id
        await expect(
            editProfile.updateProtection({
                id: `60d4f7712a117e43780a4888`,
                name: 'testpedit',
                country: ['SG'],
                protectionDefaultLang: 'en',
                protectionSupportedLang: ['en', 'fa'],
                protectionI18nOrgTitle: {
                    en: 'changeorg',
                    fa: 'یک تغییر شده',
                },
                protectionConfigTtl: '3600',
                protectionConfigTimeout: '300',
                protectionConfigWaitToSolve: '180',
                challenge: 'ldap',
                captchaDifficulty: 'easy',
                ldapUri: 'ldap://ldap.example.com',
                ldapRoUsername: 'cn=admin,dc=example,dc=com',
                ldapRoPassword: 'adminedited',
                ldapBaseDn: 'dc=example,dc=com',
                ldapFilter: '(uid={{username}})',
                ldapAttributes: [''],
            }),
        ).rejects.toThrowError();
    });

    it('edit protection no id', async () => {
        const editProfile = container.resolve('EditProtectionRepository');
        await expect(editProfile.updateProtection()).rejects.toThrowError();
    });
});
