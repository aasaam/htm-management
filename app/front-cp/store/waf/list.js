export const state = () => ({
  wafList: [],
});

export const mutations = {
  SET_WAF_LIST(state, data) {
    state.wafList = [];
    state.wafList = data;
  },
};

export const getters = {
  GET_WAF_LIST(state) {
    const list = state.wafList.map((item) => {
      return {
        name: item.profileName,
        id: item._id,
      };
    });

    return list;
  },
};

export const actions = {
  // ***************************************
  async listWaf({ commit }, inputData) {
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
            ListWaf(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id profileName deleted }
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

      const result = data.data.ListWaf;
      commit('SET_WAF_LIST', result.docs);

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
  async singleWaf({ commit }, wafId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleWaf(
                data: {
                  id: $id
                }
              ) {
                _id profileName list { name rule description } deleted
              }
            }`,
          variables: {
            id: wafId,
          },
        },
      );

      const result = data.data.SingleWaf;

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
