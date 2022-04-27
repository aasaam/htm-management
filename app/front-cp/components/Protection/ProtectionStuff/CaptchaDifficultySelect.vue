<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="$t('captchaDifficulty')"
  >
    <v-select
      v-model="difficult"
      :items="difficultyList"
      outlined
      :error-messages="errors"
      :success="valid"
      required
      item-text="name"
      item-value="value"
      :label="$t('captchaDifficulty')"
    >
    </v-select>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'CaptchaDifficultySelect',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    captchaDifficult: {
      type: String,
      require: false,
    },
  },

  data() {
    return {
      difficultyList: [
        {
          name: this.$t('easy'),
          value: 'easy',
        },
        {
          name: this.$t('medium'),
          value: 'medium',
        },
        {
          name: this.$t('hard'),
          value: 'hard',
        },
      ],
    };
  },
  computed: {
    difficult: {
      get() {
        return this.captchaDifficult;
      },
      set(newValue) {
        this.$emit('update:captchaDifficult', newValue);
      },
    },
  },
};
</script>
