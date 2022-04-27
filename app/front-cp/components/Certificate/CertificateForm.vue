<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal white--text pa-4">
        {{ title }}
      </v-card-title>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row class="pt-3">
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true, profileNameValidation: true }"
                  :name="$t('certificateName')"
                >
                  <v-text-field
                    v-model.trim="certificate.name"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('certificateName')"
                    prepend-inner-icon="mdi-account-outline"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true }"
                  :name="$t('fullChain')"
                >
                  <v-file-input
                    v-model="certificate.fullChain"
                    :error-messages="errors"
                    outlined
                    chips
                    :success="valid"
                    required
                    accept=".pem"
                    :label="$t('fullChain')"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true }"
                  :name="$t('privateKey')"
                >
                  <v-file-input
                    v-model="certificate.privateKey"
                    outlined
                    :success="valid"
                    :error-messages="errors"
                    accept=".pem"
                    chips
                    :label="$t('privateKey')"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true }"
                  :name="$t('chain')"
                >
                  <v-file-input
                    v-model="certificate.chain"
                    :error-messages="errors"
                    outlined
                    chips
                    :success="valid"
                    accept=".pem"
                    :label="$t('chain')"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>
              <v-col v-if="editMood" cols="12" md="4" lg="2">
                <v-checkbox
                  v-model="certificate.deleted"
                  :label="$t('remove')"
                ></v-checkbox>
              </v-col>
              <v-col v-if="editMood" cols="12">
                <v-divider></v-divider>
                <v-simple-table fixed-header class="elevation-3">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="grey white--text">{{ $t('name') }}</th>
                        <th class="grey white--text">
                          {{ $t('value') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(ke, i) in tableItem" :key="i">
                        <td>{{ $t(`${i}`) }}</td>
                        <td>{{ ke }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                :class="
                  $vuetify.breakpoint.smAndUp
                    ? 'd-flex justify-end align-end'
                    : ''
                "
              >
                <template v-if="!editMood">
                  <v-btn
                    :disabled="isDisabled"
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="mb-3 mr-1 ml-1 pl-12 pr-12"
                    @click.prevent="addCert"
                  >
                    {{ title }}
                  </v-btn>
                </template>
                <template v-if="editMood">
                  <v-btn
                    :disabled="isDisabled"
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="mb-3 mr-1 ml-1 pl-12 pr-12"
                    @click.prevent="editCert"
                  >
                    {{ title }}
                  </v-btn>
                </template>

                <v-btn
                  x-large
                  color="warning white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click="clear"
                >
                  {{ $t('reset') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </div>
    </v-card>
  </div>
</template>

<script>
import { to } from 'await-to-js';
import routingFn from '@/mixin/routingFn';

export default {
  name: 'CertificateForm',
  mixins: [routingFn],
  props: {
    cert: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    title: {
      required: true,
      type: String,
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editedFillersData: {},
      isDisabled: false,
    };
  },
  computed: {
    certificate: {
      cache: false,
      get() {
        return this.cert;
      },
      set(newValue) {
        this.$emit('update:cert', newValue);
      },
    },
    tableItem() {
      const infoList = {};
      infoList.name = this.certificate.name;
      infoList.issuer = this.certificate.issuer;
      infoList.sans = this.certificate.sans;
      infoList.notAfter = this.certificate.notAfter;
      infoList.sigalg = this.certificate.sigalg;
      return infoList;
    },
  },
  methods: {
    async addCert() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;

      const certData = {};
      certData.name = this.certificate.name;
      certData.fullChain = await this.convertB64(this.certificate.fullChain);
      certData.privateKey = await this.convertB64(this.certificate.privateKey);
      certData.chain = await this.convertB64(this.certificate.chain);

      const [, data] = await to(
        this.$store.dispatch('certificate/add/addCert', certData),
      );

      if (data) {
        this.redirecting('certificate-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      } else {
        this.errorCallback();
      }
    },

    async editCert() {
      this.isDisabled = true;
      let editedObj = {};

      if (this.certificate) {
        editedObj = { ...this.certificate };
      }
      editedObj = {
        id: this.certificate.id,
        name: this.certificate.name,
        deleted: this.certificate.deleted,
      };

      const [err, data] = await to(
        this.$store.dispatch('certificate/edit/editCert', editedObj),
      );

      if (data) {
        this.redirecting('certificate-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }

      if (err) {
        this.errorCallback();
      }
    },

    clear() {
      this.certificate.name = '';
      this.certificate.fullChain = null;
      this.certificate.chain = null;
      this.certificate.privateKey = null;
      this.$refs.obs.reset();
    },

    convertB64(file) {
      const f = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',').pop());
        reader.onerror = (error) => reject(error);
      });
      return f;
    },
  },
};
</script>
