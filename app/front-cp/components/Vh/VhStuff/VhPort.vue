<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: requiredF }"
    :name="$t('port')"
  >
    <v-text-field
      v-model.trim="innerPort"
      color="primary"
      :error-messages="errors"
      :success="valid"
      type="number"
      outlined
      min="80"
      max="65535"
      :label="`${$t('VhPort')}`"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    oport: {
      type: String,
      required: true,
      default: '',
    },
    requiredF: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    innerPort: {
      get() {
        return this.oport;
      },
      set(newValue) {
        this.$emit('update:oport', newValue);
      },
    },
  },
};
</script>
