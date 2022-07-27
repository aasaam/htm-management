<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8" class="mt-8">
      <v-card-title class="teal accent-4 white--text pa-4">
        {{ $t('certificate') }}
      </v-card-title>

      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row class="pt-3">
              <v-col cols="12" md="5" lg="5">
                <CertificateSelect
                  :certificate.sync="certificate"
                  :required-f="true"
                />
              </v-col>
              <v-col cols="12" md="5" lg="5">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true }"
                  :name="$t('domainName')"
                >
                  <v-text-field
                    v-model.trim="domain"
                    color="primary"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    dir="ltr"
                    hint="star.com"
                    :label="$t('domainName')"
                    @input="removeBox"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  :loading="isLoading"
                  x-large
                  color="primary"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="findVh"
                >
                  {{ $t('search') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </div>
    </v-card>
    <!-- details -->
    <div v-if="boxShow && detail !== null" class="mt-8">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-alert outlined color="purple">
            <div class="text-h6">
              <span v-if="detail.count > 0">
                <strong> {{ detail.count }}</strong> {{ $t('vhFound') }}.
                <span>
                  {{
                    $t('vhFoundSample', {
                      count: `${detail.count}`,
                    })
                  }}
                </span>
              </span>
              <span v-if="detail.count == 0">
                <strong>
                  {{ $t('notFoundPhrase', { phrase: `${domain}` }) }}</strong
                >
              </span>
            </div>
            <div class="pt-4">
              <ul>
                <li v-for="(link, id) in detail.sample" :key="id">
                  <nuxt-link
                    :to="
                      localePath({
                        path: `/virtualhost/edit/${link.id}`,
                      })
                    "
                    link
                    target="_blank"
                  >
                    <strong>{{ link.name }}</strong>
                  </nuxt-link>
                  <span class="ml-2">{{ link.host }}</span>
                </li>
              </ul>
            </div>
            <v-divider class="my-4 info" style="opacity: 0.3"></v-divider>
            <v-row v-if="detail.count > 0" class="d-flex" no-gutters>
              <v-col class="d-flex align-start">
                {{ $t('agreementToUpdate') }}
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="d-flex justify-end">
                <v-btn color="info" outlined class="mr-3 ml-3" @click="apply">
                  {{ $t('yes') }}
                </v-btn>
                <v-btn color="warning" outlined @click="cancel">
                  {{ $t('no') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { to } from 'await-to-js';

export default {
  name: 'BulkUpdateVh',
  data() {
    return {
      certificate: '',
      domain: '',
      isDisabled: false,
      isLoading: false,
      boxShow: false,
      detail: null,
    };
  },
  methods: {
    async findVh() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;
      this.isLoading = true;

      const [err, data] = await to(
        this.$store.dispatch('vh/list/findVhByDomain', this.domain),
      );
      if (data) {
        this.isDisabled = false;
        this.isLoading = false;
        this.boxShow = true;
        this.detail = data;
      }
      if (err) {
        this.isDisabled = false;
      }
    },

    cancel() {
      this.certificate = '';
      this.domain = '';
      this.boxShow = false;
      this.detail = null;
      this.$refs.obs.reset();
    },

    async apply() {
      this.isDisabled = true;
      const [err, data] = await to(
        this.$store.dispatch('vh/list/bulkUpdateCert', {
          domain: this.domain,
          certificate: this.certificate,
        }),
      );

      if (data) {
        this.isDisabled = false;
        this.cancel();
        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'virtualhost-list',
            }),
          );
        }, 900);
      }
      if (err) {
        this.isDisabled = false;
      }
    },

    removeBox() {
      this.boxShow = false;
    },
  },
};
</script>
