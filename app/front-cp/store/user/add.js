export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addUser({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $email: EmailAddress!,
            $password: String!,
            $roles: [String]!,
            $active: Boolean
            ) {
            AddUser(
              data: {
                email: $email,
                password: $password,
                roles: $roles
                active: $active
              }
            ){
              email, id
            }
        }`,
          variables: inputData,
        },
      );

      const result = data.data.AddUser;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result.id) {
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
