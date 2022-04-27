<template>
  <v-container class="pt-8" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <WafForm :title="$t('wafEdit')" :waf="waf" :edit-mood="true" />
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      wafId: this.$route.params.id,
      waf: {},
    };
  },
  head() {
    return {
      title: this.$t('wafEdit'),
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
          text: this.$t('wafEdit'),
          to: `/waf/edit/${this.wafId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.wafId) {
      const result = await this.$store.dispatch(
        'waf/list/singleWaf',
        this.wafId,
      );
      this.waf = { ...result };
    }
  },
};
</script>
