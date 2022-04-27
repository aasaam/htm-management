<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="$t('chooseChallenge')"
  >
    <v-select
      v-model="challange"
      :items="challengeList"
      outlined
      :error-messages="errors"
      :success="valid"
      required
      item-text="name"
      item-value="value"
      :label="$t('chooseChallenge')"
    >
    </v-select>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'ChallengeTypeSelect',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    challengeType: {
      type: String,
      require: false,
    },
  },

  data() {
    return {
      challengeList: [
        {
          name: this.$t('challengeJs'),
          value: 'js',
        },
        {
          name: this.$t('challengeCaptcha'),
          value: 'captcha',
        },
        {
          name: this.$t('challengeTotp'),
          value: 'totp',
        },
        {
          name: this.$t('challengeLdap'),
          value: 'ldap',
        },

        {
          name: this.$t('challengeBlock'),
          value: 'block',
        },
      ],
    };
  },
  computed: {
    challange: {
      get() {
        return this.challengeType;
      },
      set(newValue) {
        this.$emit('update:challengeType', newValue);
      },
    },
  },
};
</script>
