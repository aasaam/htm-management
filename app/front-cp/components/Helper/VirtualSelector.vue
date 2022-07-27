<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('vh')"
  >
    <v-autocomplete
      :value="vh"
      :items="vhList"
      color="primary"
      :label="$t('chooseVh')"
      outlined
      item-text="name"
      item-value="id"
      return-object
      :error-messages="errors"
      :success="valid"
      @input="updateVh"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'VirtualSelector',
  props: {
    vh: {
      type: Array,
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      vhList: 'vh/list/GET_VH_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('vh/list/listVh', {
        args: {
          filter: {
            arrIn_deleted: false,
          },
          limit: 500,
        },
      }),
    );
  },
  methods: {
    updateVh(val) {
      this.$emit('update:vh', val.id);
    },
  },
};
</script>
