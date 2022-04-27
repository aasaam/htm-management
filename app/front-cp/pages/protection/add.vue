<template>
  <v-container class="pt-8" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ProtectionForm :title="$t('protectionAdd')" :o-protection="protection" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      protection: {
        protectionDefaultLang: 'fa',
        protectionSupportedLang: ['fa', 'en'],
        protectionConfigTtl: 28800,
        protectionConfigTimeout: 600,
        protectionConfigWaitToSolve: 3,
        ldapAttributes: '["dn"]',
      },
    };
  },
  head() {
    return {
      title: this.$t('protectionAdd'),
    };
  },
  computed: {
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('protectionList'),
          to: '/protection/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('protectionAdd'),
          to: '/protection/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
