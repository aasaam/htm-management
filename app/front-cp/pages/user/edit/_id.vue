<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    <UserEditForm
      :id="currentUserId"
      :title="$t('editUser')"
      :submit-title="$t('edit')"
    />
  </v-container>
</template>

<script>
export default {
  permissions: ['SA', 'AD', 'VI'],
  data() {
    return {
      currentUserId: this.$route.params.id,
    };
  },
  head() {
    return {
      title: `${this.$t('editUser')}`,
    };
  },
};
</script>
