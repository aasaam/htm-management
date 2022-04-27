<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required, ip }"
    :name="$t('ip')"
  >
    <v-text-field
      v-model.trim="innerIp"
      color="light-blue darken-1"
      :error-messages="errors"
      :success="valid && ip !== ''"
      type="text"
      outlined
      dir="ltr"
      :label="$t('ip')"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'NodeIp',
  props: {
    ip: {
      type: String,
      required: true,
      default: '',
    },
    required: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    innerIp: {
      get() {
        return this.ip;
      },
      set(newValue) {
        this.$emit('update:ip', newValue);
      },
    },
  },
};
</script>
