export const state = () => ({
  nodeData: {},
});

export const mutations = {
  SET_NODE_DATA(state, data) {
    state.nodeData = data;
  },
};

export const getters = {
  GET_SINGLE_NODE: (state) => () => {
    return state.nodeData;
  },
};

export const actions = {
  // ***************************************
  async listNode({ commit }, inputData) {
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
            ListNode(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { id ip nodeToken port tlsVersion deleted nodeId }
              limit totalPages totalDocs
            }
          }`,
          variables: {
            filter: inputData.args.filter,
            sort: inputData.args.sort,
            page: inputData.args.page,
            limit: inputData.args.limit,
          },
        },
      );

      const result = data.data.ListNode;

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
          message: data.errors,
          status: 'error',
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // ***************************************
  async singleNode({ commit }, nodeId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
              SingleNode(
                data: {
                  id: $id
                }
              ) {
                id ip nodeToken port tlsVersion deleted nodeId
              }
            }`,
          variables: {
            id: nodeId,
          },
        },
      );

      const result = data.data.SingleNode;

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit('SET_NODE_DATA', result);
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
