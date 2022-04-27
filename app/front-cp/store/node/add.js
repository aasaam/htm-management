export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addNode({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
            ) {
            AddNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.AddNode;

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
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
      throw new Error('error');
    }
  },
};
