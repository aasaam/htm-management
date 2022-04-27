<template>
  <v-text-field
    v-model.number="cTtl"
    color="light-blue darken-1"
    type="number"
    min="3600"
    max="604800"
    outlined
    :label="$t('protectionConfigTtl')"
  ></v-text-field>
</template>
<script>
export default {
  name: 'ProtectionConfigTtl',
  props: {
    configTtl: {
      type: Number,
      required: false,
      default: 28800,
    },
  },
  computed: {
    cTtl: {
      get() {
        return this.configTtl;
      },
      set(newValue) {
        this.$emit('update:configTtl', newValue);
      },
    },
  },
};
</script>
