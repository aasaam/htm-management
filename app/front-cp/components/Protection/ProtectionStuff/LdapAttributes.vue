<template>
  <v-text-field
    v-model.trim="innerValue"
    color="light-blue darken-1"
    type="text"
    outlined
    persistent-hint
    dir="ltr"
    :hint="$t('ldapAttributesHint')"
    :label="$t('ldapAttributes')"
    @input="sendData"
  >
  </v-text-field>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: [String, Array],
      require: false,
      default: '["dn"]',
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },

  methods: {
    sendData(newValue) {
      // v = newValue.filter((item) => item !== newValue);

      // console.log(newValue, v);
      // const c = newValue.split(',');
      // const v = c.map((x) => x.trim()).filter((v, i, a) => a.indexOf(v) === i);

      this.$emit('input', newValue);
    },
  },
};
</script>
