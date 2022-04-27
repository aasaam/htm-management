<template>
  <v-text-field
    v-model.number="cWait"
    color="light-blue darken-1"
    type="number"
    min="2"
    max="180"
    outlined
    :label="$t('protectionConfigWaitToSolve')"
  ></v-text-field>
</template>
<script>
export default {
  name: 'ProtectionConfigWaitToSolve',
  props: {
    configWait: {
      type: Number,
      required: false,
      default: 3,
    },
  },
  computed: {
    cWait: {
      get() {
        return this.configWait;
      },
      set(newValue) {
        this.$emit('update:configWait', newValue);
      },
    },
  },
};
</script>
