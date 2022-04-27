export const state = () => ({
  protectionList: [],
});

export const mutations = {
  SET_PRO_LIST(state, data) {
    state.protectionList = [];
    state.protectionList = data;
  },
};

export const getters = {
  GET_PRO_LIST(state) {
    const list = state.protectionList.map((item) => {
      return {
        name: item.name,
        id: item._id,
        challenge: item.challenge,
      };
    });
    return list;
  },
};

export const actions = {
  // ***************************************
  async listProtection({ commit }, inputData) {
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
            ListProtection(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id name challenge deleted }
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

      const result = data.data.ListProtection;
      commit('SET_PRO_LIST', result.docs);

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
  async singleProtect({ commit }, protectionId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleProtection(
                data: {
                  id: $id
                }
              ) {
                id name country cidr asn asnRange clientToken challenge
                protectionDefaultLang protectionSupportedLang protectionI18nOrgTitle
                protectionConfigTtl protectionConfigTimeout protectionConfigWaitToSolve
                captchaDifficulty ldapUri ldapRoUsername ldapRoPassword ldapBaseDn ldapFilter
                ldapAttributes deleted
              }
            }`,
          variables: {
            id: protectionId,
          },
        },
      );

      const result = data.data.SingleProtection;

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
