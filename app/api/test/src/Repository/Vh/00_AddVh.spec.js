/* eslint-disable no-unused-vars */
/* eslint-env jest */
// eslint-disable-next-line node/no-unpublished-require
const { faker } = require('@faker-js/faker');
// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');

const commonFakeVars = {
    host: ['star.com', '*.yos.domain.com'],
    url: `${faker.internet.url()}`,
    port: `${faker.internet.port()}`,
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

        const ServerModel = container.resolve('ServerModel');
        const UpstreamModel = container.resolve('UpstreamModel');
        const WafModel = container.resolve('WafModel');
        const AclModel = container.resolve('AclModel');
        const ProtectionModel = container.resolve('ProtectionModel');

        await ServerModel.deleteMany({});
        await UpstreamModel.deleteMany({});
        await WafModel.deleteMany({});
        await AclModel.deleteMany({});
        await ProtectionModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    const sample = {
        name: 'testvhadv',
        advance: 1,
        advancedBody: ` listen   80;
        server_name example.org www.example.org
        error_page 404 errors/404.html;
        access_log logs/star.yourdomain.com.access.log;

        index index.php index.html index.htm;

        # static file 404's aren't logged and expires header is set to maximum age
        location ~* .(jpg|jpeg|gif|css|png|js|ico|html)$ {
          access_log off;
          expires max;
        }
        `,
    };

    const fakeId = '60d4f7712a117e43780a4888';
    const sample1 = {
        name: 'testvh',
        advance: 0,
    };

    it('virtualhost add', async () => {
        const createVh = container.resolve('CreateVhRepository');
        const createUps = container.resolve('CreateUpstreamRepository');
        const createWaf = container.resolve('CreateWafRepository');
        const createProtec = container.resolve('CreateProtectionRepository');
        const createAcl = container.resolve('CreateAclRepository');

        // **later add standard server.NO cert right now-> NO standard test available

        // add advanced server
        const res = await createVh.addVh(sample);
        expect(res).toBeTruthy();

        // catch error
        await expect(createVh.addVh(sample)).rejects.toThrowError();
        await expect(
            createVh.addVh({
                name: 'testvhadv',
                advance: 1,
            }),
        ).rejects.toThrowError();

        // isVhExistById
        expect(await createVh.isVhExistById(res.id)).toBeTruthy();
        await expect(createVh.isVhExistById()).rejects.toThrowError();
        await expect(createVh.isVhExistById(fakeId)).rejects.toThrowError();
        // returnActiveVhById
        expect(await createVh.returnActiveVhById(res.id)).toBeTruthy();
        await expect(createVh.returnActiveVhById()).rejects.toThrowError();
        await expect(
            createVh.returnActiveVhById(fakeId),
        ).rejects.toThrowError();

        // returnVhById
        expect(await createVh.returnVhById(res.id)).toBeTruthy();
        await expect(createVh.returnVhById()).rejects.toThrowError();
        await expect(createVh.returnVhById(fakeId)).rejects.toThrowError();
    });
});
