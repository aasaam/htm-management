<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6">
        {{ $t('welcome') }}
      </v-col>
      <!-- {{ $store.state.setting.all.apply }} -->
    </v-row>
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD', 'VI'],
  head() {
    return {
      title: this.$t('dashboard'),
    };
  },
};
</script>
