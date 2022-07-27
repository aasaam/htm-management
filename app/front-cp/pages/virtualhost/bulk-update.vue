<template>
  <v-container class="pt-6" fluid>
    <v-alert outlined type="info" prominent border="left">
      <div class="text-h6 pb-3">
        {{ $t('vhBulkUpdate') }}
      </div>
      <div>
        {{ $t('bulkUpdateWarning') }}
      </div>
    </v-alert>
    <BulkUpdateVH />
  </v-container>
</template>
<script>
export default {
  permissions: ['SA', 'AD'],
  data() {
    return {};
  },

  head() {
    return {
      title: this.$t('vhBulkUpdate'),
    };
  },
};
</script>
