const mercurius = require('mercurius');
const { makeExecutableSchema } = require('@graphql-tools/schema');

class GraphQL {
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static setup(fastify, container) {
    /** @type {import('mercurius').MercuriusCommonOptions} */
    const config = {
      // @ts-ignore
      schema: makeExecutableSchema({
        typeDefs: container.graphqlTypeDefs,
        resolvers: container.graphqlResolvers,
      }),
      errorFormatter(gqlContext) {
        const [e] = gqlContext.errors;
        let statusCode = 500;
        if (e.extensions && e.extensions.statusCode) {
          // @ts-ignore
          statusCode = e.extensions.statusCode;
        }
        return {
          statusCode,
          response: {
            data: gqlContext.data,
            errors: gqlContext.errors,
            extensions: gqlContext.extensions,
          },
        };
      },
      // errorFormatter(ex, cont) {

      // },
      // errorHandler(e, req, reply) {
      //   console.log('===========================');
      //   console.log(result);
      //   console.log(b);
      //   return {
      //     statusCode: 500,
      //   };
      // },
      prefix: fastify.baseURL('/graphql'),
      async context(req, reply) {
        return {
          reply,
          req,
          token: req.raw.token,
          container,
        };
      },
      subscription: {
        emitter: container.mQEmitter,

        verifyClient: ({ req }, next) => {
          const { token } = req;
          if (token) {
            return next(false);
          }
          return next(true);
        },
      },
    };

    // @ts-ignore
    fastify.register(mercurius, config);

    // const altairConfig = {
    //   baseURL: `${fastify.baseURL('/graphql/docs')}/`,
    //   path: fastify.baseURL('/graphql/docs'),
    //   endpointURL: fastify.baseURL('/graphql/graphql'),
    // };

    // fastify.register(altair, altairConfig);
  }
}

module.exports = {
  GraphQL,
};
