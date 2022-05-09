<template>
  <v-row justify="center" align="center" class="pt-4">
    <Snackbar />
    <v-col cols="12" lg="11">
      <v-alert text color="info">
        <h3 class="headline pb-3">
          {{ $t('attention') }}
        </h3>
        <div>
          {{ $t('settingDoc1') }}
        </div>

        <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
        <v-row align="center" no-gutters>
          <v-col class="grow">
            {{ $t('settingDoc2') }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="shrink">
            <v-btn color="info" outlined @click="fetchConf()">
              {{ $t('iKnow') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-col>
    <!-- editor  -->
    <v-col v-if="isHidden" cols="12" lg="11">
      <ValidationObserver ref="obs">
        <v-card :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row align="start" justify="start">
              <v-col cols="12">
                <GlobalEditor
                  :code.sync="fillData"
                  @editorData="recieveEditorData"
                />
              </v-col>
              <v-col cols="12">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required"
                  :name="$t('accept')"
                >
                  <v-checkbox
                    v-model="agree"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    value="1"
                    type="checkbox"
                    required
                    :label="`${$t('iAgree')}`"
                  ></v-checkbox>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" class="d-flex justify-end align-end">
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="primary white--text"
                  class="mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="save"
                >
                  {{ $t('apply') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
import { to } from 'await-to-js';

export default {
  name: 'SettingComponent',

  data() {
    return {
      fillData: '',
      agree: null,
      isHidden: false,
      isDisabled: false,
    };
  },
  methods: {
    recieveEditorData(value) {
      this.fillData = value;
    },
    async fetchConf() {
      const [err, data] = await to(
        this.$store.dispatch('setting/all/getSetting'),
      );
      if (data) {
        this.fillData = data;
      }
      if (err) {
        // this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 1000);
      }
      this.isHidden = true;
    },
    async save() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;
      const updateObj = {
        name: 'nginxconf',
        value: this.fillData,
      };
      const [err, data] = await to(
        this.$store.dispatch('setting/all/updateSetting', updateObj),
      );
      if (data) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
          this.$router.push(
            this.localeRoute({
              name: 'dashboard',
            }),
          );
        }, 700);
      }
      if (err) {
        this.isDisabled = false;
      }
    },
  },
};
</script>
