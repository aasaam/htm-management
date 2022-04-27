<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="$t('chooseDefaultLang')"
  >
    <v-select
      v-model="lang"
      :items="configList"
      outlined
      :error-messages="errors"
      :success="valid"
      required
      item-text="name"
      item-value="value"
      :label="$t('chooseDefaultLang')"
    >
    </v-select>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'ProtectionDefaultLang',
  props: {
    defaultLang: {
      type: String,
      default: 'fa',
      required: false,
    },
  },

  data() {
    return {
      configList: [
        {
          name: 'Farsi',
          value: 'fa',
        },
        {
          name: 'English',
          value: 'en',
        },
      ],
    };
  },
  computed: {
    lang: {
      get() {
        return this.defaultLang;
      },
      set(newValue) {
        this.$emit('update:defaultLang', newValue);
      },
    },
  },
};
</script>
