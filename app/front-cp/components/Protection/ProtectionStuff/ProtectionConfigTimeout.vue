<template>
  <v-text-field
    v-model.number="cTimeout"
    color="primary"
    type="number"
    min="300"
    max="1800"
    outlined
    :label="$t('protectionConfigTimeout')"
  ></v-text-field>
</template>
<script>
export default {
  name: 'ProtectionConfigTimeout',
  props: {
    configTimeout: {
      type: Number,
      required: false,
      default: 600,
    },
  },
  computed: {
    cTimeout: {
      get() {
        return this.configTimeout;
      },
      set(newValue) {
        this.$emit('update:configTimeout', newValue);
      },
    },
  },
};
</script>
