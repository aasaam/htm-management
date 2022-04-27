<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: requiredF }"
    :name="$t('agent')"
  >
    <v-select
      v-model="innerAgent"
      :items="agentList"
      outlined
      :error-messages="errors"
      :success="valid"
      :label="$t('chooseAgent')"
      required
    ></v-select>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'VhAgentSelector',
  props: {
    requiredF: {
      type: Boolean,
      required: true,
      default: false,
    },
    oAgent: {
      type: String,
      required: true,
      default: 'none',
    },
  },
  data() {
    return {
      agentList: ['none', 'is_modern', 'modern_or_crawler'],
    };
  },
  computed: {
    innerAgent: {
      get() {
        return this.oAgent;
      },
      set(newValue) {
        this.$emit('update:oAgent', newValue);
      },
    },
  },
};
</script>
