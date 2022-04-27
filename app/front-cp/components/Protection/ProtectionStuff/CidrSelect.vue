<template>
  <v-combobox
    v-model.trim="innerCidr"
    outlined
    hide-selected
    :label="$t('cidrSelect')"
    multiple
    small-chips
    deletable-chips
    :error-messages="errors"
    :success="valid"
    :hint="$t('cidrSelectHint')"
    persistent-hint
  >
  </v-combobox>
</template>
<script>
export default {
  name: 'CidrSelect',
  props: {
    cidr: {
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
    innerCidr: {
      get() {
        return this.cidr;
      },
      set(newValue) {
        this.$emit('update:cidr', newValue);
      },
    },
  },
  watch: {
    innerCidr(val) {
      this.errors = [];
      const cidr =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/gm;
      val.forEach((element) => {
        const trimElement = element.trim();

        if (trimElement.match(cidr)) {
          this.errors = [];
          this.valid = true;
        } else {
          this.errors = this.$t('wrongFormat', {
            field: `${element}`,
          });
          setTimeout(() => {
            this.$nextTick(() => this.innerCidr.pop());
          }, 4000);
        }
      });
    },
  },
};
</script>
