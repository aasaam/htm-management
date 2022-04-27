export const state = () => ({
  certificateList: [],
});

export const mutations = {
  SET_CERT_LIST(state, data) {
    state.certificateList = data;
  },
};

export const getters = {
  GET_CERT_LIST(state) {
    return state.certificateList.map((item) => {
      return {
        name: item.name,
        id: item._id,
        sans: item.sans,
      };
    });
  },
};

export const actions = {
  // ***************************************
  async listCert({ commit }, inputData) {
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
            ListCertificate(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id name sans issuer notAfter deleted }
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

      const result = data.data.ListCertificate;
      commit('SET_CERT_LIST', result.docs);

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        return result;
      }
    } catch (error) {
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: `${error}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // ***************************************
  async singleCert({ commit }, nodeId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleCertificate(
                data: {
                  id: $id
                }
              ) {
                id name issuer sigalg sans notAfter deleted
              }
            }`,
          variables: {
            id: nodeId,
          },
        },
      );

      const result = data.data.SingleCertificate;

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
