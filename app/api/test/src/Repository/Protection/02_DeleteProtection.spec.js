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
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    // 1. delete protection
    it('add protection and delete that', async () => {
        const createProfile = container.resolve('CreateProtectionRepository');
        const deleteProtection = container.resolve(
            'DeleteProtectionRepository',
        );

        const sample = {
            name: 'testdelete',
            country: ['JP', 'US'],
            protectionDefaultLang: 'en',
            protectionSupportedLang: ['en', 'fa'],
            protectionConfigTtl: '3600',
            protectionConfigTimeout: '300',
            protectionConfigWaitToSolve: '180',
            challenge: 'block',
            protectionI18nOrgTitle: {
                en: 'testp',
                fa: 'تست یک',
            },
        };

        const profile = await createProfile.addProtection(sample);
        const DeletedId = await deleteProtection.removeProtection(profile.id);

        expect(DeletedId).toEqual(profile.id);
    });

    it('capture delete protection error wrong id', async () => {
        const deleteProtection = container.resolve(
            'DeleteProtectionRepository',
        );

        await expect(
            deleteProtection.removeProtection('60c282c9a5868f046bb4c5d0'),
        ).rejects.toThrowError();

        await expect(
            deleteProtection.removeProtection(),
        ).rejects.toThrowError();
    });
});
