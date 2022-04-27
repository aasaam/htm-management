<template>
  <v-combobox
    v-model="innerAsn"
    outlined
    hide-selected
    :label="$t('asnRangeSelect')"
    multiple
    small-chips
    :hint="$t('asnRangeSelectHint')"
    deletable-chips
    :error-messages="errors"
    :success="valid"
    persistent-hint
  >
  </v-combobox>
</template>
<script>
export default {
  name: 'AsnRangeSelect',
  props: {
    asnRange: {
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
        return this.asnRange;
      },
      set(newValue) {
        this.$emit('update:asnRange', newValue);
      },
    },
  },
  watch: {
    innerAsn(val) {
      this.errors = [];
      val.forEach((element) => {
        const parts = /^(?<start>[0-9]+)-(?<end>[0-9]+)$/.exec(element);

        let valid = false;
        if (parts && parts.groups.start && parts.groups.end) {
          const start = parseInt(parts.groups.start, 10);
          const end = parseInt(parts.groups.end, 10);
          valid = end > start;
        }

        if (valid) {
          // valid
          this.errors = [];
          this.valid = true;
        } else {
          // not valid
          this.errors = this.$t('asnRangeWrongFormat', {
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
