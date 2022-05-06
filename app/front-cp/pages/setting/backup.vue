<template>
  <v-container fluid>
    <Snackbar />
    <v-row justify="center" align="center">
      <v-col cols="12" md="10" lg="9">
        <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
          <v-tabs
            v-model="tab"
            centered
            dark
            color="white"
            fixed-tabs
            icons-and-text
            slider-size="3"
            background-color="teal"
          >
            <v-tabs-slider color="amber darken-3"></v-tabs-slider>

            <v-tab href="#tab-1">
              {{ $t('backup') }}
              <v-icon>mdi-cloud-upload</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              {{ $t('restore') }}
              <v-icon>mdi-cloud-upload</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <!-- 1 -->
            <v-tab-item :value="'tab-1'">
              <v-card flat class="pa-3 mx-auto text-center justify-center">
                <v-card-text>
                  <p class="body-1">
                    {{ $t('backupDoc1') }}
                  </p>
                  <v-btn
                    :loading="loading3"
                    :disabled="loading3"
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="backup()"
                  >
                    {{ $t('startBackup') }}
                  </v-btn>
                  <v-row>
                    <v-col cols="12" class="mt-6">
                      <template v-if="fileName">
                        <!-- <a :href="encodeUrl()" target="_blank">
                          <v-icon large color="secondary"> mdi-eye </v-icon>
                        </a> -->
                        <v-btn
                          color="success"
                          link
                          x-large
                          :href="dlLink"
                          :disabled="loading3"
                        >
                          {{ $t('downloadBackup') }}
                          <v-icon right dark>
                            mdi-cloud-download-outline
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- 2 -->
            <v-tab-item :value="'tab-2'">
              <ValidationObserver ref="obs">
                <v-card flat class="pa-3 mx-auto text-center justify-center">
                  <v-card-text class="mx-auto">
                    <p class="body-1">
                      {{ $t('restoreDoc2') }}
                      <strong dir="ltr">7-Zip</strong>
                    </p>
                    <v-row justify="center" align="center">
                      <v-col cols="12" md="8">
                        <ValidationProvider
                          v-slot:default="{ errors, valid }"
                          :rules="{ required: true }"
                          :name="$t('restoreFile')"
                        >
                          <v-file-input
                            v-model="backupFile"
                            :error-messages="errors"
                            outlined
                            chips
                            :success="valid"
                            required
                            accept=".7z"
                            :label="$t('restoreFile')"
                          ></v-file-input>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          :disabled="isDisabled"
                          type="submit"
                          x-large
                          color="primary white--text"
                          class="mr-1 ml-1 pl-12 pr-12"
                          @click.prevent="save"
                        >
                          {{ $t('upload') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </ValidationObserver>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const { to } = require('await-to-js');

export default {
  permissions: ['SA', 'AD'],

  data() {
    return {
      tab: null,
      backupFile: null,
      isDisabled: false,
      loading3: false,
      fileName: null,
    };
  },
  head() {
    return {
      title: this.$t('backupRestore'),
    };
  },
  computed: {
    dlLink() {
      return `${window.applicationBaseURL}api/open-api/backup-download/${this.fileName}`;
    },
  },
  methods: {
    async backup() {
      this.loading3 = true;

      const [err, data] = await to(this.$store.dispatch('helper/backup'));
      if (err) {
        setTimeout(() => {
          this.loading3 = false;
        }, 2000);
      }
      if (data) {
        setTimeout(() => {
          this.fileName = data;
          this.loading3 = false;
        }, 2000);
      }
    },

    // restore
    async save() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const bFile = await this.convertB64(this.backupFile);
      const [err, data] = await to(
        this.$store.dispatch('helper/restore', bFile),
      );
      if (data) {
        this.isDisabled = true;
        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'dashboard',
            }),
          );
        }, 1500);
      }
      if (err) {
        this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 3000);
      }
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
