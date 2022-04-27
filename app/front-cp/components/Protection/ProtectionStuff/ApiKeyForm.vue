<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="name"
      outlined
      :rules="nameRules"
      :label="$t('apiKeyTitle')"
      required
      @input="disableAdd"
    ></v-text-field>
    <div v-if="duplicateMsg">
      <p class="caption red--text">
        {{ $t('duplicateApiTitle') }}
      </p>
    </div>
    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
      {{ $t('add') }}
    </v-btn>
    <v-btn
      :disabled="enableAdd"
      color="primary"
      class="mr-4"
      @click="resetingf"
    >
      {{ $t('clear') }}
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'ApiKeyForm',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    apies: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      bucket: [],
      valid: true,
      enableAdd: true,
      duplicateMsg: false,
      name: '',
      nameRules: [
        (v) => !!v || this.$t('required'),
        (v) =>
          /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(v) ||
          'Must be valid',
      ],
    };
  },
  methods: {
    validate() {
      this.enableAdd = true;
      const validatedForm = this.$refs.form.validate();
      const checkRes = this.checkDuplicate(this.name);

      if (validatedForm && checkRes) {
        // success
        this.enableAdd = false;
        this.bucket.push({
          name: this.name,
          token: this.generateToken(),
        });
        this.$emit('readyList', this.bucket);
      }
    },
    disableAdd() {
      this.enableAdd = true;
      this.duplicateMsg = false;
    },
    resetingf() {
      this.$refs.form.reset();
      this.duplicateMsg = false;
      this.enableAdd = true;
    },
    checkDuplicate(n) {
      let result = true;
      if (this.bucket.length) {
        const findDp = this.bucket.find((x) => x.name === n);

        if (findDp !== undefined) {
          this.duplicateMsg = true;
          result = false;
        }
      } else {
        return true;
      }
      return result;
    },
    generateToken() {
      const r = window
        .btoa(
          [
            Math.random().toString(36).substring(2),
            Math.random().toString(36).substring(2),
            Math.random().toString(36).substring(2),
            Math.random().toString(36).substring(2),
          ].join(':'),
        )
        .replace(/[^a-z0-9]/gi)
        .substr(0, 64);
      return r;
    },
  },
};
</script>
