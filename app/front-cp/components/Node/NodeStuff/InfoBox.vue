<template>
  <v-row>
    <v-col cols="12">
      <div v-show="showAlert">
        <v-alert border="top" prominent dark :type="type" dir="ltr">
          <pre class="pa-6 pb-4 scroll-horizon">{{ alertContent }}</pre>
        </v-alert>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    showAlert: {
      type: Boolean,
      default: false,
    },
    alertContent: {
      type: [String, Object],
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
  },
};
</script>
<style lang="scss" scoped>
.v-alert {
  overflow: auto !important;
}
.scroll-horizon {
  overflow: auto;
}
</style>
