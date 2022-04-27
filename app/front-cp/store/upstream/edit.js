export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async editUpstream({ commit }, inputData) {
    const editedObj = { ...inputData };
    delete editedObj._id;
    editedObj.id = inputData._id;

    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $id: String!,
            $advance: Int!,
            $name: String!,
            $serverList: [UpStreamServerField],
            $loadBalanceMethod: String,
            $keepalive : Int,
            $keepaliveTime : Int,
            $keepAliveRq: Int,
            $keepAliveTimeout: Int,
            $advancedBody: String
            $deleted: Boolean
            ) {
            EditUpstream(
              data: {
                id: $id,
                advance: $advance,
                name: $name,
                serverList: $serverList,
                loadBalanceMethod: $loadBalanceMethod,
                keepalive: $keepalive,
                keepaliveTime: $keepaliveTime,
                keepAliveRq: $keepAliveRq,
                keepAliveTimeout: $keepAliveTimeout,
                advancedBody: $advancedBody
                deleted: $deleted
              }
            )
        }`,
          variables: editedObj,
        },
      );

      const result = data.data.EditUpstream;
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
  // ***************************************
  async deleteUpstream({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: String!) {
            DeleteUpstream(
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

      const result = data.data.DeleteUpstream;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
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
