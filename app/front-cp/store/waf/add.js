export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addWaf({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $profileName: String!,
            $list: [inputAddWafList]!
            ) {
            AddWaf(
              data: {
                profileName: $profileName,
                list: $list
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.AddWaf;

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
