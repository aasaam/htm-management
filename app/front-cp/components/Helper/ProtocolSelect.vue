<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="`${$t('protocol')}`"
  >
    <v-select
      v-model="pro"
      :items="protocolList"
      outlined
      :error-messages="errors"
      :success="valid"
      required
      item-text="name"
      item-value="value"
      :label="`${$t('chooseProtocol')}`"
    >
    </v-select>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'ProtocolSelect',
  props: {
    protocol: {
      type: String,
      default: '',
      required: true,
    },
  },

  data() {
    return {
      protocolList: [
        {
          name: 'HTTP',
          value: 'http',
        },
        {
          name: 'HTTPS',
          value: 'https',
        },
      ],
    };
  },
  computed: {
    pro: {
      get() {
        return this.protocol;
      },
      set(newValue) {
        this.$emit('update:protocol', newValue);
      },
    },
  },
};
</script>
