<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ServerWrapper :outervh.sync="vh" :edit-mood="true" :is-adv="vh.advance" />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      vhId: this.$route.params.id,
      vh: {
        agentCheck: 'none',
        advance: 0,
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
      title: this.$t('vhEdit'),
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
          text: this.$t('vhEdit'),
          to: `/virtualhost/edit/${this.vhId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.vhId) {
      const result = await this.$store.dispatch('vh/list/singleVh', this.vhId);

      this.vh = { ...result };
      if (this.vh.host) {
        const c = this.vh.host;
        this.vh.host = c.join('\n');
      }

      if (this.vh.protection === null) {
        this.vh.protection = '1';
      }

      if (this.vh.advance === 1) {
        Object.keys(this.vh).forEach((key) => {
          if (this.vh[key] === null) {
            delete this.vh[key];
          }
        });
      }

      if (this.vh.location) {
        this.vh.location.forEach((element) => {
          if (element.headers == null) {
            element.headers = [];
          }
          if (element.proxyHeaders == null) {
            element.proxyHeaders = [];
          }

          if (element.aclProfile == null) {
            element.aclProfile = '1';
          }
        });
      }
    }
  },
};
</script>
