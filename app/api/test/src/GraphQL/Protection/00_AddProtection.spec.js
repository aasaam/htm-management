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

    const UserModel = container.resolve('UserModel');
    const ProtectionModel = container.resolve('ProtectionModel');
    await UserModel.deleteMany({});
    await ProtectionModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add protection endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makeprot@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $name: String!
            $country: [String!]
            $cidr: [String]
            $asn: [String]
            $asnRange: [String]
            $clientToken: JSONObject
            $protectionDefaultLang: String!
            $protectionSupportedLang: [String!]
            $protectionI18nOrgTitle: JSONObject
            $protectionConfigTtl: Int
            $protectionConfigTimeout: Int
            $protectionConfigWaitToSolve: Int
            $challenge: String!
            $captchaDifficulty: String
            $ldapUri: String
            $ldapRoUsername: String
            $ldapRoPassword: String
            $ldapBaseDn: String
            $ldapFilter: String
            $ldapAttributes: [String]
          ) {
          AddProtection(
              data: {
                name: $name
                country: $country
                cidr: $cidr
                asn: $asn
                asnRange: $asnRange
                clientToken: $clientToken
                protectionDefaultLang: $protectionDefaultLang
                protectionSupportedLang: $protectionSupportedLang
                protectionI18nOrgTitle: $protectionI18nOrgTitle
                protectionConfigTtl: $protectionConfigTtl
                protectionConfigTimeout: $protectionConfigTimeout
                protectionConfigWaitToSolve: $protectionConfigWaitToSolve
                challenge: $challenge
                captchaDifficulty: $captchaDifficulty
                ldapUri: $ldapUri
                ldapRoUsername: $ldapRoUsername
                ldapRoPassword: $ldapRoPassword
                ldapBaseDn: $ldapBaseDn
                ldapFilter: $ldapFilter
                ldapAttributes: $ldapAttributes
              }
            )
          }
        `,
        variables: {
          name: 'imagrprotection',
          country: ['IR'],
          cidr: ['192.168.0.0/21'],
          asn: ['32934', '13414'],
          asnRange: ['61952-62465'],
          protectionDefaultLang: 'fa',
          protectionSupportedLang: ['fa', 'en'],
          protectionI18nOrgTitle: {
            fa: 'تصویر برای امنیت',
            en: 'Image for security',
          },
          protectionConfigTtl: 3600,
          protectionConfigTimeout: 300,
          protectionConfigWaitToSolve: 60,
          challenge: 'captcha',
          captchaDifficulty: 'easy',
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddProtection).toBeTruthy();

    // error no token
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $name: String!
            $country: [String!]
            $cidr: [String]
            $asn: [String]
            $asnRange: [String]
            $clientToken: JSONObject
            $protectionDefaultLang: String!
            $protectionSupportedLang: [String!]
            $protectionI18nOrgTitle: JSONObject
            $protectionConfigTtl: Int
            $protectionConfigTimeout: Int
            $protectionConfigWaitToSolve: Int
            $challenge: String!
            $captchaDifficulty: String
            $ldapUri: String
            $ldapRoUsername: String
            $ldapRoPassword: String
            $ldapBaseDn: String
            $ldapFilter: String
            $ldapAttributes: [String]
          ) {
          AddProtection(
              data: {
                name: $name
                country: $country
                cidr: $cidr
                asn: $asn
                asnRange: $asnRange
                clientToken: $clientToken
                protectionDefaultLang: $protectionDefaultLang
                protectionSupportedLang: $protectionSupportedLang
                protectionI18nOrgTitle: $protectionI18nOrgTitle
                protectionConfigTtl: $protectionConfigTtl
                protectionConfigTimeout: $protectionConfigTimeout
                protectionConfigWaitToSolve: $protectionConfigWaitToSolve
                challenge: $challenge
                captchaDifficulty: $captchaDifficulty
                ldapUri: $ldapUri
                ldapRoUsername: $ldapRoUsername
                ldapRoPassword: $ldapRoPassword
                ldapBaseDn: $ldapBaseDn
                ldapFilter: $ldapFilter
                ldapAttributes: $ldapAttributes
              }
            )
          }
        `,
        variables: {
          name: 'anotherpro',
          country: ['IR'],
          cidr: ['192.168.0.0/21'],
          asn: ['32934', '13414'],
          asnRange: ['61952-62465'],
          protectionDefaultLang: 'en',
          protectionSupportedLang: ['fa', 'en'],
          protectionI18nOrgTitle: {
            fa: 'تصویر برای امنیت',
            en: 'Image for security',
          },
          protectionConfigTtl: 3600,
          protectionConfigTimeout: 300,
          protectionConfigWaitToSolve: 60,
          challenge: 'captcha',
          captchaDifficulty: 'hard',
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
