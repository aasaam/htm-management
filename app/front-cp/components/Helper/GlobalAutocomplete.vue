<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="label"
  >
    <v-autocomplete
      v-model="inner"
      :items="dataList"
      color="primary"
      :multiple="multiple"
      :label="label"
      outlined
      item-text="name"
      item-value="value"
      :error-messages="errors"
      :success="valid"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'GlobalAutocomplete',
  props: {
    dataList: {
      type: Array,
      default: () => [],
      required: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    model: {
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    inner: {
      get() {
        return this.model;
      },
      set(newValue) {
        this.$emit('update:model', newValue);
      },
    },
  },
};
</script>
