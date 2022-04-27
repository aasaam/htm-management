<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <template v-if="error.statusCode == 404">
        <ErrorDetail status="404" :guide-message="$t('pageNotFound')" />
      </template>
      <template v-if="error.statusCode == 403">
        <ErrorDetail status="403" :guide-message="$t('noPermission')" />
      </template>
      <template
        v-if="
          error.statusCode == 500 ||
          error.statusCode == 503 ||
          error.statusCode == 504
        "
      >
        <ErrorDetail status="500" :guide-message="$t('serverError')" />
      </template>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'empty',
  middleware: ['check-token', 'direction'],
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
  mounted() {
    this.$vuetify.theme.dark = this.$store.state.helper.darkMode;
  },
};
</script>
