<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <NodeForm :title="$t('nodeAdd')" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  head() {
    return {
      title: this.$t('nodeAdd'),
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
          text: this.$t('nodeList'),
          to: '/node/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('nodeAdd'),
          to: '/node/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
