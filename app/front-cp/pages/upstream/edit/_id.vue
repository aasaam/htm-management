<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UpstreamWrapper
      :outer-upstream.sync="upstream"
      :edit-mood="true"
      :is-adv="upstream.advance"
    />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      upstreamId: this.$route.params.id,
      upstream: {
        advance: 0,
        serverList: [{}],
      },
    };
  },
  head() {
    return {
      title: this.$t('upstreamEdit'),
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
          text: this.$t('upstreamList'),
          to: '/upstream/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('upstreamEdit'),
          to: `/upstream/edit/${this.upstreamId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.upstreamId) {
      const result = await this.$store.dispatch(
        'upstream/list/singleUpstream',
        this.upstreamId,
      );

      this.upstream = { ...result };
    }
  },
};
</script>
