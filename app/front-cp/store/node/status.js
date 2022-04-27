export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async health({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $tlsVersion: String
            $port: String
            ) {
            HealthNode(
              data: {
                ip: $ip
                nodeToken: $nodeToken
                nodeId: $nodeId
                tlsVersion: $tlsVersion
                port: $port
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.HealthNode;

      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      throw new Error(data.errors[0].message);
    }
  },

  // ***************************************
  async info({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
            $ip: IPv4!
            $nodeToken: String!
            $nodeId: String!
            $port: String
            ) {
            InfoNode(
              data: {
                ip: $ip
                port: $port
                nodeId: $nodeId
                nodeToken: $nodeToken
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.InfoNode;

      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      throw new Error(data.errors[0].message);
    }
  },

  // ***************************************
  async apply({ commit }, inputData) {
    try {
      // also get uploads progress

      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query {
              ApplyNode
            }`,
        },
      );

      const result = data.data.ApplyNode;

      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      return data.errors;
    }
  },

  // ***************************************
  async restart({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query {
            RestartNode
            }`,
        },
      );

      const result = data.data.RestartNode;

      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      return data.errors;
    }
  },
};
