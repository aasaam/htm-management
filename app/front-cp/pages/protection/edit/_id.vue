<template>
  <v-container class="pt-8" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ProtectionForm
      :title="$t('profileEdit')"
      :o-protection="protection"
      :edit-mood="true"
    />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {
      protection: {},
      protectionId: this.$route.params.id,
    };
  },
  head() {
    return {
      title: this.$t('editProtectionProfile'),
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
          text: this.$t('protectionList'),
          to: '/protection/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('editProtectionProfile'),
          to: `/protection/edit/${this.protectionId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    if (this.protectionId) {
      const result = await this.$store.dispatch(
        'protection/list/singleProtect',
        this.protectionId,
      );
      this.protection = { ...result };
    }
  },
};
</script>
