<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('profile')"
  >
    <v-autocomplete
      :value="pagespeed"
      :items="psList"
      color="blue-grey lighten-2"
      :label="$t('choosePageSpeedProfile')"
      outlined
      :error-messages="errors"
      :success="valid"
      @input="$emit('update:pagespeed', $event)"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'PageSpeedSelect',
  props: {
    pagespeed: {
      type: String,
      default: '',
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      psList: ['none', 'profile1', 'profile2'],
    };
  },
};
</script>
