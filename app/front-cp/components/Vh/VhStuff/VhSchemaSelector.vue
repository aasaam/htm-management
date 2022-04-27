<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: requiredF }"
    :name="$t('schema')"
  >
    <v-select
      v-model="innerScheme"
      :items="schema"
      multiple
      outlined
      :error-messages="errors"
      :success="valid"
      :label="$t('chooseSchema')"
      required
    ></v-select>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'VhSchemaSelector',
  props: {
    requiredF: {
      type: Boolean,
      required: true,
      default: false,
    },
    oschema: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      schema: ['http', 'https'],
    };
  },
  computed: {
    innerScheme: {
      get() {
        return this.oschema;
      },
      set(newValue) {
        this.$emit('update:oschema', newValue);
      },
    },
  },
};
</script>
