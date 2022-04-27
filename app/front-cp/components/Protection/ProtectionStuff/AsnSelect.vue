<template>
  <v-combobox
    v-model="innerAsn"
    outlined
    hide-selected
    :label="$t('asnSelect')"
    multiple
    persistent-hint
    :hint="$t('asnSelectHint')"
    small-chips
    deletable-chips
    :error-messages="errors"
    :success="valid"
  >
  </v-combobox>
</template>
<script>
export default {
  name: 'AsnSelect',
  props: {
    asn: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      errors: [],
      valid: false,
    };
  },
  computed: {
    innerAsn: {
      get() {
        return this.asn;
      },
      set(newValue) {
        this.$emit('update:asn', newValue);
      },
    },
  },
  watch: {
    innerAsn(val) {
      this.errors = [];
      val.forEach((element) => {
        if (element >= 0 && element <= 4294967295) {
          this.errors = [];
          this.valid = true;
        } else {
          this.errors = this.$t('asnWrongFormat', {
            field: `${element}`,
          });
          setTimeout(() => {
            this.$nextTick(() => this.innerAsn.pop());
          }, 4000);
        }
      });
    },
  },
};
</script>
