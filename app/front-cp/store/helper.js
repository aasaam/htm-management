export const state = () => ({
  darkMode: true,
});

export const mutations = {
  SWITCH_DARK(state) {
    state.darkMode = !state.darkMode;
  },
};

export const getters = {};

export const actions = {
  // **************template *************************
  async generate({ commit }, info) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($type: String! $id: String, $dataModel: JSONObject) {
              RenderConfig(
                  data: {
                    type: $type
                    id: $id
                    dataModel: $dataModel
                  }
                )
              }`,
          variables: {
            dataModel: info.dataModel,
            type: info.type,
            id: info.id,
          },
        },
      );

      const result = data.data.RenderConfig;

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

  // *****************backup**********************
  async backup({ commit }) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query {
              Backup
            }`,
        },
      );

      const result = data.data.Backup;

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

  // *****************restore**********************
  async restore({ commit }, info) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($file: String!) {
            Restore(
                  data: {
                    file: $file
                  }
                )
              }`,
          variables: {
            file: info,
          },
        },
      );

      const result = data.data.Restore;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'RESTORED',
            status: 'success',
          },
          { root: true },
        );
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
