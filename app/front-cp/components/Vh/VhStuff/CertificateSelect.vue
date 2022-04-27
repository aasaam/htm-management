<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: requiredF }"
    :name="$t('certificate')"
  >
    <v-autocomplete
      :value="certificate"
      :items="certificateList"
      color="blue-grey lighten-2"
      :label="$t('chooseCertificate')"
      outlined
      item-text="name"
      item-value="id"
      return-object
      :error-messages="errors"
      :success="valid"
      @input="$emit('update:certificate', $event.id)"
    >
      <template slot="item" slot-scope="{ item }">
        <span class="pr-2">{{ item.name }}</span>
        <v-icon small>mdi-arrow-right </v-icon>
        <span v-for="i in item.sans.slice(0, 6)" :key="i">
          <v-chip x-small label class="ml-1 mr-1">
            {{ i }}
          </v-chip>
        </span>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'CertificateSelect',
  props: {
    certificate: {
      type: String,
      default: '',
      required: true,
    },
    requiredF: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      certificateList: 'certificate/list/GET_CERT_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('certificate/list/listCert', {
        args: {
          limit: 50,
        },
      }),
    );
  },
};
</script>
