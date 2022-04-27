/* eslint-disable sonarjs/no-duplicate-string */
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

    const UserModel = container.resolve('UserModel');
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  // it should create user-admin and generate otp
  it('graphql user otp generate endpoint', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper0@gmail.com',
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
            $id: String!, $currentPassword : String
          ) {
          OtpGenerate(
              data: {
                id: $id
                currentPassword: $currentPassword
              }
            )
          }
        `,
        variables: {
          id: `${user.id}`,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.OtpGenerate).toBeTruthy();
  });

  // token error
  it('No token error:graphql user otp generate endpoint', async () => {
    const { user } = await helper.CreateUserHeaderAndToken(
      'maryhelper01@gmail.com',
      ['SA'],
      true,
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $id: String!, $currentPassword : String
          ) {
          OtpGenerate(
              data: {
                id: $id
                currentPassword: $currentPassword
              }
            )
          }
        `,
        variables: {
          id: `${user.id}`,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(405);
  });

  //  error no id
  it('No Id send error:graphql user otp generate endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper011@gmail.com',
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
            $id: String!, $currentPassword : String
          ) {
          OtpGenerate(
              data: {
                id: $id
                currentPassword: $currentPassword
              }
            )
          }
        `,
        variables: {
          id: ``,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(400);
  });

  // other user should send current pass
  it('graphql user otp generate endpoint-other user should send current pass', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper9870@gmail.com',
      ['AD', 'VI'],
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
              $id: String!, $currentPassword : String
            ) {
            OtpGenerate(
                data: {
                  id: $id
                  currentPassword: $currentPassword
                }
              )
            }
          `,
        variables: {
          id: `${user.id}`,
        },
      },
    });

    const { errors } = JSON.parse(data1.body);
    expect(errors['0'].extensions.statusCode).toEqual(400);
  });
});
