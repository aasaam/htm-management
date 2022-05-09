<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('nodeId')"
  >
    <v-text-field
      v-model.trim="innerNodeId"
      color="primary"
      :error-messages="errors"
      :success="valid && nodeId !== ''"
      type="text"
      dir="ltr"
      outlined
      :label="$t('nodeId')"
    >
    </v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'NodeId',
  props: {
    nodeId: {
      type: String,
      required: true,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    innerNodeId: {
      get() {
        return this.nodeId;
      },
      set(newValue) {
        this.$emit('update:nodeId', newValue);
      },
    },
  },
};
</script>
