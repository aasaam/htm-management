export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async editUser({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $id: String!,
            $email: EmailAddress,
            $roles: [String],
            $active: Boolean
            ) {
            EditUser(
              data: {
                id: $id,
                email: $email,
                roles: $roles
                active: $active
              }
            ){
              id
            }
        }`,
          variables: inputData,
        },
      );

      const result = data.data.EditUser;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result.id) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Edited user.',
          },
          { root: true },
        );
        return true;
      }
    } catch (error) {
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: `${error}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // ***************************************
  async updatePasswordUser({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $id: String!,
            $newPassword: String!,
            $currentPassword: String
            ) {
            UpdateUserPassword(
              data: {
                id: $id,
                newPassword: $newPassword,
                currentPassword: $currentPassword,
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.UpdateUserPassword;

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
};
