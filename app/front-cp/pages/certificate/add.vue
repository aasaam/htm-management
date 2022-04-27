<template>
  <v-container class="pt-8" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <CertificateForm :title="$t('certificateAdd')" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  head() {
    return {
      title: this.$t('certificateAdd'),
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
          text: this.$t('certificateList'),
          to: '/certificate/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('certificateAdd'),
          to: '/certificate/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
