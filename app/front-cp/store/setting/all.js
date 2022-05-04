export const state = () => ({
  apply: {},
});

export const mutations = {
  SET_APPLY_TIMES(state, payload) {
    state.apply = { ...payload };
  },
};

export const getters = {
  getChangeTime(state) {
    return state.apply.changeTimeModule;
  },

  getApplyTime(state) {
    return state.apply.applyTimeModule;
  },

  calcApplyBtnVisibility(state) {
    const showBtn = false;
    // if changeTime & lastApplyTime is equal, dont show apply button
    if (state.apply.changeTimeModule === state.apply.applyTimeModule) {
      return showBtn;
    }
    // if changeTime & lastApplyTime is not equal, show apply button
    return !showBtn;
  },
};

export const actions = {
  // *************NGINX**************************
  async getSetting({ commit }) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($name: String!) {
          Setting(
            data: {
              name: $name,
            }
          )
        }`,
          variables: {
            name: 'nginxconf',
          },
        },
      );

      const result = data.data.Setting;
      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      throw new Error(data);
    }
  },
  // *************NGINX**************************
  async updateSetting({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
              $name: String!
              $value: String!
              ) {
                UpdateSetting(
                data: {
                  name: $name
                  value: $value
                }
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.UpdateSetting;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
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

  // ******************OTHER*********************
  async readSetting({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($name: String!, $name1: String!) {
            changeTimeModule: ConfigReader(
              data: {
                name: $name1,
              }
            )
            applyTimeModule: ConfigReader(
              data: {
                name: $name,
              }
            )
        }`,
          variables: {
            name: 'changeTime',
            name1: 'lastApplyTime',
          },
        },
        { progress: false },
      );

      commit('SET_APPLY_TIMES', data.data);
    } catch (error) {
      const { data } = error.response;
      throw new Error(data);
    }
  },

  // ******************subscribe test*********************
  // async testsub() {
  //   try {
  //     const res = await this.$axios.post(
  //       `${window.applicationBaseURL}api/graphql/graphql`,
  //       {
  //         query: `subscription {
  //           SubSetting
  //       }`,
  //       },
  //     );

  //     // if (result) {
  //     //   return result;
  //     // }
  //   } catch (error) {
  //     const { data } = error.response;
  //     throw new Error(data);
  //   }
  // },
};
