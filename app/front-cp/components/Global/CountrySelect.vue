<template>
  <ValidationProvider v-slot:default="{ errors, valid }" :name="$t('country')">
    <v-autocomplete
      v-model="innercountry"
      :items="items"
      outlined
      color="primary"
      :error-messages="errors"
      :success="valid"
      item-text="name"
      item-value="alpha2Code"
      multiple
      autocomplete
      :label="$t('selectCountry')"
    >
      <template slot="item" slot-scope="{ item }">
        <span class="pr-2">{{ item.emoji }}</span>
        {{ item.name }} ({{ item.nativeName }})
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>
<script>
import country from '@/utils/country';

export default {
  name: 'CountrySelect',

  props: {
    aclCountry: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      items: country,
    };
  },

  computed: {
    innercountry: {
      get() {
        return this.aclCountry;
      },
      set(newValue) {
        this.$emit('update:aclCountry', newValue);
      },
    },
  },
};
</script>
