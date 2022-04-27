<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <AclForm
      :title="$t('aclEdit')"
      :acl="acl"
      :edit-mood="true"
      :ip-list.sync="manipulatedList"
    />
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      aclId: this.$route.params.id,
      acl: {},
      manipulatedList: null,
    };
  },
  head() {
    return {
      title: this.$t('aclEdit'),
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
          to: '/acl/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('aclEdit'),
          to: `/acl/edit/${this.aclId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.aclId) {
      const result = await this.$store.dispatch(
        'acl/list/singleAcl',
        this.aclId,
      );
      this.acl = { ...result };
      const c = this.acl.list;
      this.manipulatedList = c.join('\n');
    }
  },
};
</script>
