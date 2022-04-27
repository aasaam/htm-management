<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <WafForm :title="$t('wafAdd')" :waf.sync="waf" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      waf: {
        list: [{}],
      },
    };
  },
  head() {
    return {
      title: this.$t('wafAdd'),
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
          text: this.$t('wafList'),
          to: '/waf/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('wafAdd'),
          to: '/waf/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
