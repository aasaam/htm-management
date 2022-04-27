<template>
  <v-container class="pt-8" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <CertificateForm :title="$t('certEdit')" :cert="cert" :edit-mood="true" />
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      certId: this.$route.params.id,
      cert: {},
    };
  },
  head() {
    return {
      title: this.$t('certEdit'),
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
          text: this.$t('certEdit'),
          to: `/certificate/edit/${this.certId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.certId) {
      const result = await this.$store.dispatch(
        'certificate/list/singleCert',
        this.certId,
      );
      this.cert = { ...result };
    }
  },
};
</script>
