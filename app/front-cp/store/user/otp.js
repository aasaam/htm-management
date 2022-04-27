export const actions = {
  // ***************************************
  async otpGenerate({ commit }, userData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: String!, $currentPassword : String ) {
            OtpGenerate(
              data: {
                id: $id
                currentPassword: $currentPassword
              }
            )
          }`,
          variables: {
            id: userData.id,
            currentPassword: userData.currentPassword,
          },
        },
      );

      const result = data.data.OtpGenerate;

      if (result !== null) {
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
