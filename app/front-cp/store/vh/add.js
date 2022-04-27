export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addVh({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation(
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
        }`,
          variables: inputData,
        },
      );

      const result = data.data.AddVh;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'CREATED',
            status: 'success',
          },
          { root: true },
        );
        return true;
      }
    } catch (error) {
      const { data } = error.response;

      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data.errors,
          status: 'error',
        },
        { root: true },
      );
      throw new Error(data);
    }
  },
};
