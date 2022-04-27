/* eslint-disable no-underscore-dangle */
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
    const NodeModel = container.resolve('NodeModel');
    await UserModel.deleteMany({});
    await NodeModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql delete node endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'marydelnode@gmail.com',
      ['SA'],
      true,
    );

    const viRole = await helper.CreateUserHeaderAndToken(
      'maryvirole@gmail.com',
      ['VI'],
      true,
    );

    const nodeRes = await helper.createNode();

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
          mutation( $id: String! ) {
            DeleteNode(
              data: {
                id: $id,
              }
            )
          }
        `,
        variables: {
          id: `${nodeRes.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.DeleteNode).toBeTruthy();
    expect(JSON.stringify(data.DeleteNode)).toEqual(JSON.stringify(nodeRes.id));

    // no token error
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation( $id: String! ) {
            DeleteNode(
              data: {
                id: $id,
              }
            )
          }
        `,
        variables: {
          id: `${nodeRes.id}`,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);

    // error role
    const data3 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${
          viRole.token
        }`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation( $id: String! ) {
            DeleteNode(
              data: {
                id: $id,
              }
            )
          }
        `,
        variables: {
          id: `${nodeRes.id}`,
        },
      },
    });

    const a = JSON.parse(data3.body);
    expect(a.errors['0'].extensions.statusCode).toEqual(403);

    // error id params
    const data4 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation( $id: String! ) {
            DeleteNode(
              data: {
                id: $id,
              }
            )
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const b = JSON.parse(data4.body);
    expect(b.errors['0'].extensions.statusCode).toEqual(422);
  });
});
