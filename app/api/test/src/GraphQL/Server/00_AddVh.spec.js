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
    await UserModel.deleteMany({});

    const ServerModel = container.resolve('ServerModel');
    const UpstreamModel = container.resolve('UpstreamModel');
    const WafModel = container.resolve('WafModel');
    const ProtectionModel = container.resolve('ProtectionModel');
    await ServerModel.deleteMany({});
    await UpstreamModel.deleteMany({});
    await WafModel.deleteMany({});
    await ProtectionModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => {
      setTimeout(r, 100);
    });
    await container.dispose();
  });

  it('graphql add vh endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'makevhgraph@gmail.com',
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
            $advance: Int!
            $certificate: ObjectID
            $protection: String
            $pageSpeed: String
            $advancedBody: String
            $host: [String]
            $alwaysServeHttp: Boolean
            $orgTitle: String
            $orgIcon: String
            $agentCheck: String
            $keepAliveRq: Int
            $keepAliveTimeout: Int
            $requestPoolSize: Int
            $clientHeaderTimeout: Int
            $clientHeaderBufferSize: Int
            $largeClientHeaderBufferSize: Int
            $largeClientHeaderBufferNumber: Int
            $wafMode: String
            $location: [VhLocationField]
          ) {
            AddVh(
              data: {
                name: $name
                advance: $advance
                certificate: $certificate
                protection: $protection
                pageSpeed: $pageSpeed
                advancedBody: $advancedBody
                host: $host
                alwaysServeHttp: $alwaysServeHttp
                orgTitle: $orgTitle
                orgIcon: $orgIcon
                agentCheck: $agentCheck
                keepAliveRq: $keepAliveRq
                keepAliveTimeout: $keepAliveTimeout
                requestPoolSize: $requestPoolSize
                clientHeaderTimeout: $clientHeaderTimeout
                clientHeaderBufferSize: $clientHeaderBufferSize
                largeClientHeaderBufferSize: $largeClientHeaderBufferSize
                largeClientHeaderBufferNumber: $largeClientHeaderBufferNumber
                wafMode: $wafMode
                location: $location
              }
            )
          }
        `,
        variables: {
          name: 'imgraphvhh',
          advance: 1,
          advancedBody: `
            server {
              listen 8080;
              root /data/up1;

              location / {
              }
          }
          `,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.AddVh).toBeTruthy();

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $name: String!
            $advance: Int!
            $certificate: ObjectID
            $protection: String
            $pageSpeed: String
            $advancedBody: String
            $host: [String]
            $alwaysServeHttp: Boolean
            $orgTitle: String
            $orgIcon: String
            $agentCheck: String
            $keepAliveRq: Int
            $keepAliveTimeout: Int
            $requestPoolSize: Int
            $clientHeaderTimeout: Int
            $clientHeaderBufferSize: Int
            $largeClientHeaderBufferSize: Int
            $largeClientHeaderBufferNumber: Int
            $wafMode: String
            $location: [VhLocationField]
          ) {
            AddVh(
              data: {
                name: $name
                advance: $advance
                certificate: $certificate
                protection: $protection
                pageSpeed: $pageSpeed
                advancedBody: $advancedBody
                host: $host
                alwaysServeHttp: $alwaysServeHttp
                orgTitle: $orgTitle
                orgIcon: $orgIcon
                agentCheck: $agentCheck
                keepAliveRq: $keepAliveRq
                keepAliveTimeout: $keepAliveTimeout
                requestPoolSize: $requestPoolSize
                clientHeaderTimeout: $clientHeaderTimeout
                clientHeaderBufferSize: $clientHeaderBufferSize
                largeClientHeaderBufferSize: $largeClientHeaderBufferSize
                largeClientHeaderBufferNumber: $largeClientHeaderBufferNumber
                wafMode: $wafMode
                location: $location
              }
            )
          }
        `,
        variables: {
          name: 'imgraphvhh',
          advance: 1,
          advancedBody: `
            server {
              listen 8080;
              root /data/up1;

              location / {
              }
          }
          `,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
