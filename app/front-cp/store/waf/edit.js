export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async editWaf({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $id: String!
            $profileName: String
            $list: [inputAddWafList]
            $deleted: Boolean
            ) {
            EditWaf(
              data: {
                id: $id,
                profileName: $profileName,
                list: $list
                deleted: $deleted
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.EditWaf;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'EDITED',
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
  // ***************************************
  async deleteWaf({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: String!) {
            DeleteWaf(
                data: {
                  id: $id,
                }
              )
          }`,
          variables: {
            id,
          },
        },
      );

      const result = data.data.DeleteWaf;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'DELETED',
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
