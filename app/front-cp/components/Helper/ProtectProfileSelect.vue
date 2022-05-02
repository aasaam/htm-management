<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: required }"
    :name="$t('protectionProfile')"
  >
    <v-autocomplete
      :value="protection"
      :items="psList"
      item-text="name"
      item-value="id"
      return-object
      color="blue-grey lighten-2"
      :label="$t('chooseProtectionProfile')"
      outlined
      :error-messages="errors"
      :success="valid"
      @input="$emit('update:protection', $event.id)"
    >
      <template slot="item" slot-scope="{ item }">
        <span class="pr-2">{{ item.name }}</span>

        <v-chip
          v-if="item.challenge"
          small
          label
          class="ml-1 mr-1"
          color="orange"
        >
          Challange:
          <span class="ml-1 mr-1 font-weight-bold">{{ item.challenge }}</span>
        </v-chip>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'ProtectProfileSelect',
  props: {
    protection: {
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
      psList: 'protection/list/GET_PRO_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('protection/list/listProtection', {
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
