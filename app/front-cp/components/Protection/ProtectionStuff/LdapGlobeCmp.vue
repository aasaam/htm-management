<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="rules"
    :name="label"
  >
    <v-text-field
      v-model.trim="innerValue"
      color="light-blue darken-1"
      :error-messages="errors"
      :success="valid"
      type="text"
      dir="ltr"
      persistent-hint
      outlined
      :hint="hint"
      :label="label"
      class="forceLtr"
    >
    </v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
      require: false,
    },
    label: {
      type: String,
      require: true,
      default: '',
    },
    rules: {
      type: Object,
      require: false,
      default: () => ({}),
    },
    hint: {
      type: String,
      require: false,
      default: '',
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('update:value', newValue);
      },
    },
  },
};
</script>
