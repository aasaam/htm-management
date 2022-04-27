<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ServerWrapper :outervh.sync="vh" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      vh: {
        agentCheck: 'none',
        location: [
          {
            headers: [],
            proxyHeaders: [],
          },
        ],
      },
    };
  },

  head() {
    return {
      title: this.$t('vhAdd'),
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
          text: this.$t('virtualhostList'),
          to: '/virtualhost/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('vhAdd'),
          to: '/virtualhost/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
