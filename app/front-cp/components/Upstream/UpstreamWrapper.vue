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
        slider-size="3"
        icons-and-text
        active-class="teal darken-2"
      >
        <v-tabs-slider color="amber darken-3"></v-tabs-slider>

        <v-tab href="#standard">
          {{ $t('standardUpstream') }}
          <v-icon>mdi-server-network</v-icon>
        </v-tab>

        <v-tab href="#advance">
          {{ $t('advancedUpstream') }}
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
                  :name="$t('upstreamName')"
                >
                  <v-text-field
                    v-model.trim="upstream.name"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('upstreamName')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors }"
                  :rules="{ required: true }"
                  :name="$t('mood')"
                >
                  <v-radio-group
                    v-model="upstream.advance"
                    :error-messages="errors"
                    row
                  >
                    <v-radio
                      :label="$t('addStandardUpstream')"
                      :value="0"
                    ></v-radio>
                    <v-radio
                      :label="$t('addAdvancedUpstream')"
                      :value="1"
                    ></v-radio>
                  </v-radio-group>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-tab-item value="standard">
              <v-divider></v-divider>
              <!-- Standard -->
              <UpstreamForm :o-upstream="upstream" :required-f="tellMood" />
            </v-tab-item>
            <!-- Advanced -->
            <v-tab-item value="advance">
              <ManualUpstream
                :name.sync="upstream.name"
                :fill-adv-data.sync="upstream.advancedBody"
                @advanceDatafiller="addToGlobalobj"
              />
            </v-tab-item>
          </v-form>

          <v-row class="pa-6">
            <v-col v-if="editMood" cols="12" md="4" lg="2">
              <v-checkbox
                v-model="upstream.deleted"
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
              <template v-if="upstream.advance == 0">
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
                  @click.prevent="addUpstream"
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
                  @click.prevent="editUpstream"
                >
                  {{ $t('edit') }}
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
        </ValidationObserver>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { to } from 'await-to-js';
import routingFn from '@/mixin/routingFn';

export default {
  name: 'UpstreamWrapper',
  mixins: [routingFn],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    outerUpstream: {
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
    upstream: {
      get() {
        return this.outerUpstream;
      },
      set(v) {
        this.$emit('update:outerUpstream', v);
      },
    },
    tellMood() {
      if (this.upstream.advance === 1) {
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
      this.upstream.advancedBody = val;
    },
    async addUpstream() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }

      this.isDisabled = true;

      const upstreamCopy = { ...this.upstream };
      if (upstreamCopy.serverList) {
        upstreamCopy.serverList.forEach((item) => {
          // delete all null value
          Object.keys(item).forEach((key) => {
            if (item[key] === null) {
              delete item[key];
            }
          });
        });
      }

      const [err, data] = await to(
        this.$store.dispatch('upstream/add/addUpstream', upstreamCopy),
      );

      if (data) {
        this.redirecting('upstream-list');
        this.$nextTick(() => {
          // this.clear();
          this.$refs.obs.reset();
        });
      }
      if (err) {
        this.errorCallback();
      }
    },
    async editUpstream() {
      const cloned = { ...this.upstream };

      Object.keys(cloned).forEach((key) => {
        if (cloned[key] === null) {
          delete cloned[key];
        }
      });

      const [err, data] = await to(
        this.$store.dispatch('upstream/edit/editUpstream', cloned),
      );

      if (data) {
        this.redirecting('upstream-list');
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
      }
      if (err) {
        this.errorCallback();
      }
    },
    async generateConfig() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('helper/generate', {
          type: 'upstream',
          dataModel: this.upstream,
        }),
      );
      if (data) {
        this.dataCode = data;
        this.showConfigDialog = true;
      }
      if (err) {
        this.isDisabled = false;
      }
    },
    clear() {
      this.upstream.name = '';
      this.upstream.serverList.forEach((element) => {
        element.server = null;
        element.weight = 1;
        element.maxConnection = 0;
        element.maxFails = 0;
        element.backup = null;
        element.down = null;
      });
      this.$refs.obs.reset();
    },
  },
};
</script>
