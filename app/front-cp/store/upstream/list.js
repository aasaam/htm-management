export const state = () => ({
  upstreamList: [],
});

export const mutations = {
  SET_UPSTR_LIST(state, data) {
    // state.upstreamList = [];
    state.upstreamList = data;
  },
};

export const getters = {
  GET_UPSTR_LIST(state) {
    return state.upstreamList.map((item) => {
      return {
        name: item.name,
        id: item._id,
      };
    });
  },
};

export const actions = {
  // ***************************************
  async listUpstream({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
            $filter: JSON,
            $sort: JSON,
            $page: Int,
            $limit: Int,
            ) {
            ListUpstream(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id advance name loadBalanceMethod deleted }
              limit totalPages totalDocs
            }
          }`,
          variables: {
            filter: inputData.args.filter,
            sort: inputData.args.sort,
            page: inputData.args.page,
            limit: inputData.args.limit,
            // limit: inputData.args.limit ? inputData.args.limit : 30,
          },
        },
      );

      const result = data.data.ListUpstream;

      commit('SET_UPSTR_LIST', result.docs);

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;

      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data.errors['0'].extensions
            ? `Error ${data.errors['0'].extensions.statusCode} ${data.errors['0'].message}`
            : `${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // ***************************************
  async singleUpstream({ commit }, upstreamId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleUpstream(
                data: {
                  id: $id
                }
              ) {
                serverList { server port weight maxConnection maxFails failTimeout backup down }
                _id advance name deleted
                loadBalanceMethod keepaliveTime keepalive keepAliveRq keepAliveTimeout advancedBody
              }
            }`,
          variables: {
            id: upstreamId,
          },
        },
      );

      const result = data.data.SingleUpstream;

      if (result) {
        return result;
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
