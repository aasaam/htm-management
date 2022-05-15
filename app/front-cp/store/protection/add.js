export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async addProtection({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $name: String!
            $country: [String!]
            $cidr: [String]
            $asn: [String]
            $asnRange: [String]
            $clientToken: JSONObject
            $protectionDefaultLang: String!
            $protectionSupportedLang: [String!]
            $protectionI18nOrgTitle: JSONObject
            $protectionConfigTtl: Int
            $protectionConfigTimeout: Int
            $protectionConfigWaitToSolve: Int
            $challenge: String!
            $captchaDifficulty: String
            $ldapUri: String
            $ldapRoUsername: String
            $ldapRoPassword: String
            $ldapBaseDn: String
            $ldapFilter: String
            $totpSecret: String
            $ldapAttributes: [String]
            ) {
            AddProtection(
              data: {
                name: $name
                country: $country
                cidr: $cidr
                asn: $asn
                asnRange: $asnRange
                clientToken: $clientToken
                protectionDefaultLang: $protectionDefaultLang
                protectionSupportedLang: $protectionSupportedLang
                protectionI18nOrgTitle: $protectionI18nOrgTitle
                protectionConfigTtl: $protectionConfigTtl
                protectionConfigTimeout: $protectionConfigTimeout
                protectionConfigWaitToSolve: $protectionConfigWaitToSolve
                challenge: $challenge
                captchaDifficulty: $captchaDifficulty
                totpSecret: $totpSecret
                ldapUri: $ldapUri
                ldapRoUsername: $ldapRoUsername
                ldapRoPassword: $ldapRoPassword
                ldapBaseDn: $ldapBaseDn
                ldapFilter: $ldapFilter
                ldapAttributes: $ldapAttributes
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.AddProtection;

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
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

  // ***************************************
  async otpGenerator({ commit }) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query {
              ProfileOtpGenerator
            }`,
        },
      );

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (data.data) {
        return data.data.ProfileOtpGenerator;
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
