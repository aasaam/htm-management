<template>
  <v-dialog v-model="syncDialog" scrollable max-width="1400">
    <template v-if="type === 'upstream'">
      <UpstreamV :details="detail" />
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    detail: {
      type: Object,
      required: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String,
      required: false,
    },
  },
  computed: {
    syncDialog: {
      get() {
        return this.dialog;
      },
      set(v) {
        this.$emit('update:dialog', v);
      },
    },
    headersData() {
      return Object.keys(this.detail);
    },
    bodyData() {
      return Object.values(this.detail);
    },
  },
};
</script>
