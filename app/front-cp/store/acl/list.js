export const state = () => ({
  aclList: [],
});

export const mutations = {
  SET_ACL_LIST(state, data) {
    state.aclList = [];
    state.aclList = data;
  },
};

export const getters = {
  GET_ACL_LIST(state) {
    const list = state.aclList.map((item) => {
      return {
        name: item.name,
        id: item._id,
      };
    });

    list.unshift({
      name: 'none',
      id: '1',
    });

    return list;
  },
};

export const actions = {
  // ***************************************
  async listAcl({ commit }, inputData) {
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
            ListAcl(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id name mood deleted }
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

      const result = data.data.ListAcl;
      commit('SET_ACL_LIST', result.docs);

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
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // ***************************************
  async singleAcl({ commit }, aclId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleAcl(
                data: {
                  id: $id
                }
              ) {
                id name mood list deleted
              }
            }`,
          variables: {
            id: aclId,
          },
        },
      );

      const result = data.data.SingleAcl;

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
};
