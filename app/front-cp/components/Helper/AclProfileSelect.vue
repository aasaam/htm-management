<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('acl')"
  >
    <v-autocomplete
      :value="acl"
      :items="aclList"
      color="blue-grey lighten-2"
      :label="$t('chooseAcl')"
      outlined
      item-text="name"
      item-value="id"
      return-object
      :error-messages="errors"
      :success="valid"
      @input="updateAcl"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'AclProfileSelect',
  props: {
    acl: {
      type: [String, null],
      default: '',
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
      aclList: 'acl/list/GET_ACL_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('acl/list/listAcl', {
        args: {
          filter: {
            arrIn_deleted: false,
          },
          limit: 40,
        },
      }),
    );
  },
  methods: {
    updateAcl(val) {
      this.$emit('update:acl', val.id);
    },
  },
};
</script>
