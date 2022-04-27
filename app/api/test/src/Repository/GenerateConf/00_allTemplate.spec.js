/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');
const Helper = require('../../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
    /** @type {import('awilix').AwilixContainer} */
    let container;

    /** @type {import('../../Helper/Helper')} */
    let helper;

    beforeAll(async () => {
        const config = new Config(ConfigSchema, {});
        container = await initContainer(config);
        helper = new Helper(container);

        const setting = container.resolve('ActionSettingRepository');
        const conf = container.resolve('ApplySettingRepository');
        await setting.initNginxConf();
        await conf.initializeTimeConfig();

        const AclModel = container.resolve('AclModel');
        await AclModel.deleteMany({});

        const ProtectionModel = container.resolve('ProtectionModel');
        await ProtectionModel.deleteMany({});

        const WafModel = container.resolve('WafModel');
        await WafModel.deleteMany({});

        const UpstreamModel = container.resolve('UpstreamModel');
        await UpstreamModel.deleteMany({});

        const ServerModel = container.resolve('ServerModel');
        await ServerModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    it('read all', async () => {
        const conf = container.resolve('GenerateAllRepository');

        // ** 1- ACL **
        const createAcl = container.resolve('CreateAclRepository');
        await createAcl.addAcl('profile1', 0, ['10.0.0.0/9', '172.16.0.0']);

        // ** 2- Protection **
        const createProfile = container.resolve('CreateProtectionRepository');
        const sample = {
            name: 'testp',
            asn: ['32934', '32935'],
            protectionDefaultLang: 'fa',
            protectionSupportedLang: ['en', 'fa'],
            protectionI18nOrgTitle: {
                en: 'testp',
                fa: 'تست یک',
            },
            challenge: 'block',
        };
        await createProfile.addProtection(sample);

        // ** 3- Waf **
        const createWaf = container.resolve('CreateWafRepository');
        await createWaf.addWafProfile('profilewaf3', [
            {
                name: 'imvalidwaf',
                rule: 'BasicRule wl:13 "mz:$HEADERS_VAR:cookie"',
            },
        ]);

        // ** 4- Upstream **
        await helper.createAdvanceUpstream();

        // ** 4- Vh **
        await helper.createAdvanceVh();

        // FINALLY , READ ALL , WRITE TO FILE
        expect(await conf.generateAllConfFile()).toBe(true);
    });
});
