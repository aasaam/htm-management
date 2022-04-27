<template>
  <v-autocomplete
    v-model="innerName"
    item-text="name"
    item-value="value"
    :label="$t('name')"
    :items="items"
    color="blue-grey lighten-2"
    outlined
  >
  </v-autocomplete>
</template>

<script>
export default {
  name: 'WafLastName',
  props: {
    name: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      items: [
        { name: 'Empty', value: 'Empty' },
        { name: 'NAME', value: 'NAME' },
      ],
    };
  },
  computed: {
    innerName: {
      get() {
        return this.name;
      },
      set(v) {
        this.$emit('update:name', v);
      },
    },
  },
};
</script>
