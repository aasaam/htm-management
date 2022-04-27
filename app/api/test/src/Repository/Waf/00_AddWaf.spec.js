/* eslint-env jest */
// eslint-disable-next-line node/no-unpublished-require
const { faker } = require('@faker-js/faker');
// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');

const commonFakeVars = {
    basicRule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
    description: `im a fake ${faker.unique(faker.name.jobDescriptor)}`,
};

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

        const WafModel = container.resolve('WafModel');
        await WafModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('waf profile error no params', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        await expect(createWaf.addWafProfile()).rejects.toThrowError();
    });

    it('waf profile error wrong name', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        await expect(
            createWaf.addWafProfile('a', [
                {
                    name: 'allrules',
                    rule: commonFakeVars.basicRule,
                },
            ]),
        ).rejects.toThrowError();
    });

    it('waf profile error wrong rule', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        await expect(
            createWaf.addWafProfile('rightname1', [
                {
                    name: 'allrules',
                    rule: 'heyyou',
                },
            ]),
        ).rejects.toThrowError();
    });

    it('waf profile error no list name', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        await expect(
            createWaf.addWafProfile('rightname1', [
                {
                    name: '',
                    rule: commonFakeVars.basicRule,
                },
            ]),
        ).rejects.toThrowError();
    });

    it('add waf profile', async () => {
        const createWaf = container.resolve('CreateWafRepository');

        expect(
            await createWaf.addWafProfile('profilewaf3', [
                {
                    name: 'imvalidwaf',
                    rule: commonFakeVars.basicRule,
                    description: commonFakeVars.description,
                },
            ]),
        ).toBeTruthy();
    });

    it('isWafProfileExistById', async () => {
        const createWaf = container.resolve('CreateWafRepository');

        const w = await createWaf.addWafProfile('profilewafidf', [
            {
                name: 'wafpro1',
                rule: commonFakeVars.basicRule,
                description: commonFakeVars.description,
            },
        ]);

        expect(await createWaf.isWafProfileExistById(w.id)).toBeTruthy();
        expect(await createWaf.returnActiveWafById(w.id)).toBeTruthy();
        expect(await createWaf.returnWafById(w.id)).toBeTruthy();
        await expect(
            createWaf.isWafProfileExistById(''),
        ).rejects.toThrowError();
        await expect(createWaf.returnActiveWafById('')).rejects.toThrowError();
        await expect(createWaf.returnWafById()).rejects.toThrowError();
        await expect(
            createWaf.returnWafById('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
        await expect(
            createWaf.returnActiveWafById('60d4f7712a117e43780a4888'),
        ).rejects.toThrowError();
    });

    // 9. isWafProfileExistById
    it('isWafProfileExistById', async () => {
        const createWaf = container.resolve('CreateWafRepository');

        await expect(
            createWaf.returnActiveWafById('60d9b7d3fcab856633ea1111'),
        ).rejects.toThrowError();
    });

    // 10. duplicate
    it('isWafProfileDuplicate', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        await createWaf.addWafProfile('heyimdupliwaf', [
            {
                name: 'wafpro1',
                rule: commonFakeVars.basicRule,
                description: commonFakeVars.description,
            },
        ]);

        await expect(
            createWaf.addWafProfile('heyimdupliwaf', [
                {
                    name: 'wafpro1',
                    rule: commonFakeVars.basicRule,
                    description: commonFakeVars.description,
                },
            ]),
        ).rejects.toThrowError();
    });
});
