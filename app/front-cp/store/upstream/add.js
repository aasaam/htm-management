export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addUpstream({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
            ) {
            AddUpstream(
              data: {
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
              }
            )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.AddUpstream;

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
