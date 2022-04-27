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

        const WafModel = container.resolve('WafModel');
        await WafModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('waf profile edit error no params id', async () => {
        const editWaf = container.resolve('EditWafRepository');
        await expect(editWaf.updateWaf({ id: '' })).rejects.toThrowError();
    });

    it('edit waf profile', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        const editWaf = container.resolve('EditWafRepository');
        const w = await createWaf.addWafProfile('profilewafedit4', [
            {
                name: 'wafpro1',
                rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
            },
        ]);

        expect(
            await editWaf.updateWaf({
                id: `${w.id}`,
                profileName: 'edityouwaf',
                list: [
                    {
                        name: 'heyyou',
                        rule: 'BasicRule wl:1 "mz:$HEADERS_VAR:cookie"',
                        description: 'need this for rules.',
                    },
                ],
            }),
        ).toBeTruthy();

        expect(
            await editWaf.updateWaf({
                id: `${w.id}`,
                profileName: 'edityouwaf',
            }),
        ).toBeTruthy();
    });

    it('edit waf profile error', async () => {
        const createWaf = container.resolve('CreateWafRepository');
        const editWaf = container.resolve('EditWafRepository');
        const w = await createWaf.addWafProfile('profilewafedit5', [
            {
                name: 'wafpro1',
                rule: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
            },
        ]);

        await expect(
            editWaf.updateWaf({
                id: `${w.id}`,
                profileName: 'edityouwaf',
                list: [
                    {
                        name: 'a',
                        rule: 'BasicRule wl:1 "mz:$HEADERS_VAR:cookie"',
                        description: 'need this for rules.',
                    },
                ],
            }),
        ).rejects.toThrowError();

        await expect(
            editWaf.updateWaf({
                id: `${w.id}`,
                profileName: 'edityouwaf',
                list: [
                    {
                        rule: '"mz:$HEADERS_VAR:cookie"',
                    },
                ],
            }),
        ).rejects.toThrowError();
    });
});
