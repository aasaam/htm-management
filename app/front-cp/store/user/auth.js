const tokenCheckTimeName = 'tokenCheckTime';

export const state = () => ({
  userData: {},
  isLogin: false,
  tokenExp: '',
});

export const mutations = {
  SET_USER_DATA(state, data) {
    state.userData = data;
    localStorage.setItem(tokenCheckTimeName, new Date().toString());
    state.isLogin = true;
  },

  CLEAR_USER_DATA(state) {
    state.userData = {};
    localStorage.removeItem(tokenCheckTimeName);
    state.isLogin = false;
  },
};

export const getters = {
  GET_ROLE(state) {
    let roles = [];
    if (state.userData.roles) {
      roles = state.userData.roles;
      return state.userData.roles;
    }
    return roles;
  },

  GET_AUTHENTICATED(state) {
    return state.isLogin;
  },
};

export const actions = {
  async signIn({ commit }, user) {
    try {
      const response = await this.$axios.post(
        `${window.applicationBaseURL}api/open-api/user/auth/login`,
        user,
      );
      const { data } = response;

      commit('SET_USER_DATA', data);
      if (response.status === 200) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'WELCOME',
            status: 'success',
          },
          { root: true },
        );
      }
      return data;
    } catch (error) {
      const { data } = error.response;

      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data,
          status: 'restError',
          statusText: error.response.statusText,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // *****************************************
  async refreshToken({ commit, getters, state }) {
    let tryCallRefreshToken = true;
    const tokenCheckTime = localStorage.getItem(tokenCheckTimeName);

    if (tokenCheckTime !== null) {
      const expirationTime = new Date(tokenCheckTime);
      const recent = new Date();
      recent.setTime(recent.getTime() - 60 * 1000);
      if (expirationTime > recent) {
        tryCallRefreshToken = false;
      }
    }

    if (tryCallRefreshToken) {
      try {
        const response = await this.$axios.get(
          `${window.applicationBaseURL}api/open-api/user/auth/refresh`,
        );
        const { data } = response;
        commit('SET_USER_DATA', data);
      } catch (error) {
        commit('CLEAR_USER_DATA');
        this.app.router.push('/');
      }
    }
  },
};
