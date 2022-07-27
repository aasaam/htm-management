/* eslint-env jest */

const { Config } = require('../../src/Config');
const { ConfigSchema } = require('../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  it('Config', async () => {
    const envObject = {
      ASM_PUBLIC_NUM1: '1000',
      ASM_NUM2: '1001',
      NOT_CONVENTION: 1,
      ASM_ZIP_PASSWORD: 'coffee',
    };

    const schema = {
      type: 'object',
      required: [
        'ASM_PUBLIC_NUM1',
        'ASM_NUM2',
        'ASM_NUM_DEFAULT',
        'ASM_ZIP_PASSWORD',
      ],
      properties: {
        ASM_PUBLIC_NUM1: {
          type: 'number',
          default: 3000,
        },
        ASM_NUM2: {
          type: 'number',
          default: 3000,
        },
        ASM_NUM_DEFAULT: {
          type: 'number',
          default: 4000,
        },
        ASM_ZIP_PASSWORD: {
          type: 'string',
          default: 'coffee',
        },
      },
    };

    const cnf = new Config(schema, envObject);
    const allCnf = cnf.getAll();
    const publicCnf = cnf.getPublic();

    expect(allCnf.ASM_NUM_DEFAULT).toBe(4000);
    expect(allCnf.ASM_PUBLIC_NUM1).toBe(1000);
    expect(allCnf.ASM_PUBLIC_NUM1).toBe(publicCnf.ASM_PUBLIC_NUM1);
    expect(allCnf.ASM_NUM2).toBe(1001);

    expect(publicCnf.ASM_NUM2).toBe(undefined);
    expect(publicCnf.NOT_CONVENTION).toBe(undefined);
  });

  it('ConfigSchema with defaults', async () => {
    const appConfig = new Config(ConfigSchema, {
      ASM_ZIP_PASSWORD: 'coffee',
    });
    expect(appConfig.getAll()).toBeTruthy();
  });
});
