<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    rules="required"
    :name="$t('name')"
  >
    <v-text-field
      v-model.trim="innerName"
      outlined
      required
      hint="ARGS"
      persistent-hint
      :label="$t('name')"
      dir="ltr"
      :error-messages="errors"
      :success="valid"
      type="text"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'WafMzName',
  props: {
    mzname: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      // select: [],
    };
  },
  computed: {
    innerName: {
      get() {
        return this.mzname;
      },
      set(v) {
        this.$emit('update:mzname', v);
      },
    },
  },
};
</script>
