<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    rules="required"
    :name="$t(label)"
  >
    <v-text-field
      v-model.trim="innerValue"
      outlined
      required
      clearable
      :hint="hint"
      persistent-hint
      dir="ltr"
      :label="label"
      :error-messages="errors"
      :success="valid"
      type="text"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'WafMzValue',
  props: {
    mzv: {
      type: String,
      default: '',
      required: false,
    },
    hint: {
      type: String,
      required: true,
    },
    label: {
      type: String,

      required: true,
    },
  },

  computed: {
    innerValue: {
      get() {
        return this.mzv;
      },
      set(v) {
        this.$emit('update:mzv', v);
      },
    },
  },
};
</script>
