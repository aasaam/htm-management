export const actions = {
  // ***************************************
  async editVh({ commit }, inputData) {
    const editedObj = { ...inputData };
    delete editedObj._id;
    editedObj.id = inputData._id;
    if (editedObj.certificate === '') {
      delete editedObj.certificate;
    }

    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $id: String
            $name: String!
            $advance: Int!
            $certificate: ObjectID
            $protection: String
            $pageSpeed: String
            $advancedBody: String
            $host: [String]
            $alwaysServeHttp: Boolean
            $orgTitle: String
            $orgIcon: String
            $agentCheck: String
            $keepAliveRq: Int
            $keepAliveTimeout: Int
            $requestPoolSize: Int
            $clientHeaderTimeout: Int
            $clientHeaderBufferSize: Int
            $largeClientHeaderBufferSize: Int
            $largeClientHeaderBufferNumber: Int
            $wafMode: String
            $location: [VhLocationField]
            $deleted: Boolean
            ) {
            EditVh(
              data: {
                id: $id,
                name: $name
                advance: $advance
                certificate: $certificate
                protection: $protection
                pageSpeed: $pageSpeed
                advancedBody: $advancedBody
                host: $host
                alwaysServeHttp: $alwaysServeHttp
                orgTitle: $orgTitle
                orgIcon: $orgIcon
                agentCheck: $agentCheck
                keepAliveRq: $keepAliveRq
                keepAliveTimeout: $keepAliveTimeout
                requestPoolSize: $requestPoolSize
                clientHeaderTimeout: $clientHeaderTimeout
                clientHeaderBufferSize: $clientHeaderBufferSize
                largeClientHeaderBufferSize: $largeClientHeaderBufferSize
                largeClientHeaderBufferNumber: $largeClientHeaderBufferNumber
                wafMode: $wafMode
                location: $location
                deleted: $deleted
              }
            )
        }`,
          variables: editedObj,
        },
      );

      const result = data.data.EditVh;

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
    }
  },
  // ***************************************
  async deleteVh({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: String!) {
            DeleteVh(
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

      const result = data.data.DeleteVh;

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
      throw new Error(data);
    }
  },
};
