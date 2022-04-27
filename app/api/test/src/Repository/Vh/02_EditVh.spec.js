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

        const ServerModel = container.resolve('ServerModel');

        await ServerModel.deleteMany({});
    });

    afterAll(async () => {
        await new Promise((r) => {
            setTimeout(r, 100);
        });
        await container.dispose();
    });

    it('edit vh', async () => {
        const editVh = container.resolve('EditVhRepository');
        const vhData = await helper.createAdvanceVh();

        expect(
            await editVh.updateVh({
                id: vhData.id,
                name: 'editedyouvh',
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
            }),
        ).toBeTruthy();

        // error no id
        await expect(editVh.updateVh({})).rejects.toThrowError();
        await expect(
            editVh.updateVh({
                id: '60d4f7712a117e43780a4888',
                name: 'editedyouvh',
                advance: 1,
                advancedBody: ` listen   80;
                server_name example.org www.example.org
        
                index index.php index.html index.htm;
        
                # static file 404's aren't logged and expires header is set to maximum age
                location ~* .(jpg|jpeg|gif|css|png|js|ico|html)$ {
                access_log off;
                expires max;
                }
                `,
            }),
        ).rejects.toThrowError();
    });
});
