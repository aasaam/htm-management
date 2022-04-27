<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    rules="required"
    :name="$t('target')"
  >
    <v-autocomplete
      v-model="innerTarget"
      :label="$t('target')"
      :items="items"
      color="blue-grey lighten-2"
      outlined
      dir="ltr"
      clearable
      persistent-hint
      :error-messages="errors"
      :success="valid"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'WafMzTarget',
  props: {
    mztarget: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      items: [
        'URL',
        'ARGS',
        'BODY',
        'FILE_EXT',
        'HEADERS',
        '$ARGS_VAR_X',
        '$BODY_VAR_X',
        '$HEADERS_VAR_X',
      ],
    };
  },
  computed: {
    innerTarget: {
      get() {
        return this.mztarget;
      },
      set(v) {
        this.$emit('update:mztarget', v);
      },
    },
  },
  watch: {
    mztarget(v) {
      if (v === 'ARGS' || v === 'BODY' || v === 'HEADERS') {
        this.$emit('clearmzV', v);
      }
    },
  },
};
</script>
