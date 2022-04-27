export const actions = {
  // ***************************************
  async listVh({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
            $filter: JSON,
            $sort: JSON,
            $page: Int,
            $limit: Int,
            ) {
            ListVh(
              args: {
                filter: $filter,
                sort : $sort,
                page: $page,
                limit: $limit,
              }
            ) {
              docs { _id name  advance deleted }
              limit totalPages totalDocs
            }
          }`,
          variables: {
            filter: inputData.args.filter,
            sort: inputData.args.sort,
            page: inputData.args.page,
            limit: inputData.args.limit,
          },
        },
      );

      const result = data.data.ListVh;

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
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
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error(data);
    }
  },

  // ***************************************
  async singleVh({ commit }, vhId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: String!) {
            SingleVh(
                data: {
                  id: $id
                }
              ) {
                _id name advance certificate protection host alwaysServeHttp
                orgTitle orgIcon advancedBody keepAliveRq deleted agentCheck
                keepAliveTimeout requestPoolSize clientHeaderTimeout clientHeaderBufferSize
                largeClientHeaderBufferSize largeClientHeaderBufferNumber wafMode pageSpeed
                location { path locationType redirectStatus redirectToUrl upstreamProfile aclProfile waf  proxySchema
                clientMaxBodySize clientBodyBufferSize standardCache activeProtection headers proxyHeaders }
              }
            }`,
          variables: {
            id: vhId,
          },
        },
      );

      const result = data.data.SingleVh;

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
      throw new Error(data);
    }
  },
};
