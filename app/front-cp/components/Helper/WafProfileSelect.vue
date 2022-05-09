<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('waf')"
  >
    <v-autocomplete
      :value="waf"
      :items="wafList"
      color="primary"
      :label="$t('chooseWafProfile')"
      item-text="name"
      item-value="id"
      return-object
      outlined
      :error-messages="errors"
      :success="valid"
      @input="$emit('update:waf', $event.id)"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'WafProfileSelect',
  props: {
    waf: {
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
  computed: {
    ...mapGetters({
      wafList: 'waf/list/GET_WAF_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('waf/list/listWaf', {
        args: {
          filter: {
            arrIn_deleted: false,
          },
          limit: 40,
        },
      }),
    );
  },
};
</script>
