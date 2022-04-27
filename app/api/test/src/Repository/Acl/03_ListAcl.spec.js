/* eslint-disable security/detect-object-injection */
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

        const AclModel = container.resolve('AclModel');
        await AclModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await container.dispose();
    });

    // 1. list acl
    it('add node and check list', async () => {
        const createAcl = container.resolve('CreateAclRepository');
        const listAcl = container.resolve('ListAclRepository');

        const fakeData = [
            {
                name: 'imafakeacl1',
                mood: 0,
                list: ['10.0.0.0/8'],
            },
            {
                name: 'imafakeacl2',
                mood: 1,
                list: ['10.0.0.0/8', '10.0.0.0/4', '10.0.0.0/4', '10.0.0.0'],
            },
        ];

        const promises = [];

        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < fakeData.length; index++) {
            promises.push(
                createAcl.addAcl(
                    fakeData[index].name,
                    fakeData[index].mood,
                    fakeData[index].list,
                ),
            );
        }

        await Promise.all(promises);

        const listDoc = await listAcl.getAclList({
            query: {},
            page: 1,
            limit: 5,
        });
        expect(listDoc.docs).toBeTruthy();
    });
});
