<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <AclForm :title="$t('aclAdd')" :acl="acl" :ip-list.sync="list" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      acl: {},
      list: '',
    };
  },
  head() {
    return {
      title: this.$t('aclAdd'),
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
          text: this.$t('aclList'),
          to: '/acl/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('aclAdd'),
          to: '/acl/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
