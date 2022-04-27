export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  async logOut({ commit }) {
    try {
      const response = await this.$axios.get(
        `${window.applicationBaseURL}api/open-api/user/logout`,
      );

      if (response.status === 204) {
        return true;
      }
    } catch (error) {
      if (error.message) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'red',
            message: `${error.message}`,
          },
          { root: true },
        );
        throw new Error('error');
      }
      throw new Error('error');
    }
  },
};
