<template>
  <div>
    <v-autocomplete
      v-model="supported"
      :items="items"
      outlined
      item-text="nativeName"
      item-value="code"
      multiple
      autocomplete
      :label="$t('selectCountry')"
    >
      {{ items.nativeName }}
    </v-autocomplete>
  </div>
</template>

<script>
import { by639_1 as By639 } from 'iso-language-codes';

export default {
  name: 'CountrySelect',

  props: {
    value: {
      type: Array,
      default: () => ['fa', 'en'],
      required: false,
    },
  },

  computed: {
    items() {
      const items = Object.keys(By639).map((key) => {
        return {
          nativeName: By639[key].nativeName,
          code: key,
        };
      });
      return items;
    },
    supported: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('update:value', newValue);
      },
    },
  },
};
</script>
