<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('token')"
  >
    <v-text-field
      v-model.trim="innerToken"
      color="light-blue darken-1"
      :error-messages="errors"
      :success="valid && token !== ''"
      type="text"
      outlined
      dir="ltr"
      :label="$t('token')"
    >
    </v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'NodeToken',
  props: {
    token: {
      type: String,
      required: true,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    innerToken: {
      get() {
        return this.token;
      },
      set(newValue) {
        this.$emit('update:token', newValue);
      },
    },
  },
};
</script>
