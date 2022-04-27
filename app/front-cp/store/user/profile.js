export const state = () => ({
  profileData: {},
});

export const mutations = {
  SET_USER_DATA(state, data) {
    state.profileData = data;
  },
};

export const getters = {
  GET_SINGLE_USER: (state) => () => {
    return state.profileData;
  },
};

export const actions = {
  // ***************************************
  async singleUser({ commit }, userId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            ProfileUser(
              data: {
                id: $id
              }
            ) {
              id roles active email otpSecret active
            }
          }`,
          variables: {
            id: userId,
          },
        },
      );

      const result = data.data.ProfileUser;

      if (result) {
        commit('SET_USER_DATA', result);
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
