<template>
  <div>
    <Snackbar />
    <!-- <v-alert text outlined color="deep-orange" icon="mdi-alert" class="mb-4">
      {{ $t('fillDoc') }}
    </v-alert> -->
    <ShowConfDialog
      :dialog.sync="showConfigDialog"
      :title="$t('showConfig')"
      :data="dataCode"
    />

    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-tabs
        v-model="tab"
        background-color="teal"
        centered
        dark
        fixed-tabs
        color="white"
        icons-and-text
        active-class="teal darken-2"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#standard">
          {{ $t('standardVhost') }}
          <v-icon>mdi-server-network</v-icon>
        </v-tab>

        <v-tab href="#advance">
          {{ $t('advancedVhost') }}
          <v-icon>mdi-cog</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items :value="tab">
        <ValidationObserver ref="obs">
          <v-form novalidate="true">
            <v-row justify="center" align="center" class="pa-6">
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true, profileNameValidation: true }"
                  :name="$t('name')"
                >
                  <v-text-field
                    v-model.trim="vh.name"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('name')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors }"
                  :rules="{ required: true }"
                  :name="$t('mode')"
                >
                  <v-radio-group
                    v-model="vh.advance"
                    :error-messages="errors"
                    row
                  >
                    <v-radio :label="$t('saveStandard')" :value="0"></v-radio>
                    <v-radio :label="$t('saveAdvance')" :value="1"></v-radio>
                  </v-radio-group>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-tab-item value="standard">
              <v-divider></v-divider>
              <!-- Standard -->
              <VhForm :ovh="vh" :required-f="tellMood" />
            </v-tab-item>
            <!-- Advanced -->
            <v-tab-item value="advance">
              <ManualVh
                :fill-adv-data.sync="vh.advancedBody"
                @advanceDatafiller="addToGlobalobj"
              />
            </v-tab-item>
          </v-form>

          <v-row class="pa-4">
            <v-col v-if="editMood" cols="12" md="4" lg="2">
              <v-checkbox
                v-model="vh.deleted"
                :label="$t('remove')"
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              :class="
                $vuetify.breakpoint.smAndUp
                  ? 'mt-3 d-flex justify-end align-end'
                  : ''
              "
            >
              <template v-if="(vh.advance == 0) & editMood">
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="teal darken-2 white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="generateConfig"
                >
                  {{ $t('showConfig') }}
                </v-btn>
              </template>
              <template v-if="!editMood">
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="primary white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="addServer"
                >
                  {{ $t('add') }}
                </v-btn>
              </template>
              <template v-if="editMood">
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="primary white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="editServer"
                >
                  {{ $t('edit') }}
                </v-btn>
              </template>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { to } from 'await-to-js';
import covertStToArry from '@/mixin/covertStToArry';
import routingFn from '@/mixin/routingFn';

export default {
  name: 'ServerWrapper',
  mixins: [covertStToArry, routingFn],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    outervh: {
      type: Object,
      require: false,
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
    isAdv: {
      required: false,
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dataCode: '',
      showConfigDialog: false,
      isDisabled: false,
    };
  },
  computed: {
    tab: {
      set(tab) {
        this.$router.replace({ query: { ...this.$route.query, tab } });
      },
      get() {
        return this.$route.query.tab;
      },
    },
    vh: {
      get() {
        return this.outervh;
      },
      set(v) {
        this.$emit('update:outervh', v);
      },
    },
    tellMood() {
      if (this.vh.advance === 1) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    isAdv(a) {
      if (a === 1) {
        this.tab = 'advance';
      } else {
        this.tab = 'standard';
      }
    },
  },
  methods: {
    addToGlobalobj(val) {
      this.vh.advancedBody = val;
    },
    async addServer() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const newVh = this.readyToCall();

      this.isDisabled = true;
      const [err, data] = await to(this.$store.dispatch('vh/add/addVh', newVh));

      if (data) {
        this.redirecting('virtualhost-list');
      }
      if (err) {
        this.errorCallback();
      }
    },

    async editServer() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const newEditVh = this.readyToCall();

      const [err, data] = await to(
        this.$store.dispatch('vh/edit/editVh', newEditVh),
      );
      if (data) {
        this.redirecting('virtualhost-list');
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
      }
      if (err) {
        this.errorCallback();
      }
    },

    readyToCall() {
      const newVh = { ...this.vh };

      if (newVh.advance === 0) {
        if (newVh.host) {
          newVh.host = this.manipulateList(newVh.host);
        }

        Object.keys(newVh).forEach((key) => {
          if (newVh[key] === null) {
            delete newVh[key];
          }
          if (newVh.wafMode === 'disable' && newVh.location.length > 0) {
            newVh.location.forEach((item) => {
              item.waf = null;
            });
          }

          if (this.vh.protection === '1') {
            newVh.protection = null;
          }
        });
      }

      if (newVh.advance === 1) {
        delete newVh.location;
        delete newVh.host;
        delete newVh.schema;
        if (newVh.protection === '1') {
          newVh.protection = null;
        }
      }

      if (newVh && newVh.location) {
        newVh.location.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (item.aclProfile === '1') {
              item.aclProfile = null;
            }
            if (item[key] === null) {
              delete item[key];
            }
          });
        });
      }

      return newVh;
    },

    async generateConfig() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const gvh = this.readyToCall();
      if (gvh) {
        const [err, data] = await to(
          this.$store.dispatch('helper/generate', {
            type: 'vh',
            dataModel: gvh,
          }),
        );
        if (data) {
          this.dataCode = data;
          this.showConfigDialog = true;
        }
        if (err) {
          this.isDisabled = false;
        }
      }
    },
  },
};
</script>
