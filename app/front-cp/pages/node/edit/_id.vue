<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <template v-if="loading">
      <NodeForm :title="$t('nodeEdit')" :node="node" :edit-mood="true" />
    </template>
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      nodeId: this.$route.params.id,
      node: {},
      loading: false,
    };
  },
  head() {
    return {
      title: this.$t('nodeEdit'),
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
          text: this.$t('nodeEdit'),
          to: `/node/edit/${this.nodeId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },

  async mounted() {
    this.loading = false;
    if (this.nodeId) {
      const result = await this.$store.dispatch(
        'node/list/singleNode',
        this.nodeId,
      );
      if (result) {
        this.loading = true;
      }
      this.node = { ...result };
    }
  },
};
</script>
