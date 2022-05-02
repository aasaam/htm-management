<template>
  <div class="mx-auto">
    <Snackbar />
    <InfoBox
      :show-alert="alertVisibility"
      :alert-content="alertContent"
      :type="type"
    />

    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal white--text pa-4">
        {{ title }}
      </v-card-title>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row class="pt-3">
              <!-- ip -->
              <v-col cols="12" md="6" lg="4">
                <NodeIp :ip.sync="nodes.ip" :required="true" />
              </v-col>
              <!-- token -->
              <v-col cols="12" md="6" lg="4">
                <NodeToken :token.sync="nodes.nodeToken" :required="true" />
              </v-col>
              <!-- port -->
              <v-col cols="12" md="6" lg="4">
                <v-text-field
                  v-model.trim="nodes.port"
                  color="light-blue darken-1"
                  type="number"
                  min="80"
                  max="65535"
                  dir="ltr"
                  outlined
                  :label="$t('port')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <GlobalAutocomplete
                  :data-list="tlsList"
                  :multiple="false"
                  :model.sync="nodes.tlsVersion"
                  :required="true"
                  :label="$t('chooseTlsVersion')"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <NodeId :node-id.sync="nodes.nodeId" :required="true" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="4" lg="2">
                <v-checkbox
                  v-model="nodes.deleted"
                  :label="$t('remove')"
                ></v-checkbox>
              </v-col>
            </v-row>
            <!-- actions -->
            <v-row>
              <v-col
                cols="12"
                :class="
                  $vuetify.breakpoint.smAndUp
                    ? 'd-flex justify-end align-end'
                    : ''
                "
              >
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="green white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click.prevent="checkNode"
                >
                  {{ $t('checkNodeStatus') }}
                </v-btn>
                <template v-if="!editMood">
                  <v-btn
                    v-if="ifNodeUp"
                    :disabled="addNodeDisable"
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="mb-3 mr-1 ml-1 pl-12 pr-12"
                    @click.prevent="addNode"
                  >
                    {{ title }}
                  </v-btn>
                </template>
                <template v-if="editMood">
                  <v-btn
                    v-if="ifNodeUp"
                    :disabled="addNodeDisable"
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="mb-3 mr-1 ml-1 pl-12 pr-12"
                    @click.prevent="editNode"
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
  name: 'NodeForm',
  mixins: [routingFn],
  props: {
    node: {
      type: Object,
      required: false,
      default: () => ({
        port: '9199',
        tlsVersion: 'intermediate',
      }),
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
      type: 'info',
      ifNodeUp: false,
      alertVisibility: false,
      alertContent: '',
      isDisabled: false,
      addNodeDisable: false,
      tlsList: [
        {
          name: this.$t('modern'),
          value: 'modern',
        },
        {
          name: this.$t('intermediate'),
          value: 'intermediate',
        },
        {
          name: this.$t('legacy'),
          value: 'legacy',
        },
      ],
    };
  },
  computed: {
    nodes: {
      cache: false,
      get() {
        return this.node;
      },
      set(newValue) {
        this.$emit('update:node', newValue);
      },
    },
  },
  methods: {
    async checkNode() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;
      const [err, data] = await to(
        this.$store.dispatch('node/status/health', this.nodes),
      );
      if (data) {
        this.alertVisibility = true;
        this.ifNodeUp = true;
        this.alertContent = data;
        this.type = 'success';
        this.isDisabled = true;
      }
      if (err) {
        this.alertVisibility = true;
        this.alertContent = `${err}`;
        this.isDisabled = false;
        this.type = 'error';
      }
    },
    async addNode() {
      const [err, data] = await to(
        this.$store.dispatch('node/add/addNode', this.nodes),
      );

      if (data) {
        this.redirecting('node-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }

      if (err) {
        this.errorCallback();
      }
    },
    async editNode() {
      const [err, data] = await to(
        this.$store.dispatch('node/edit/editNode', this.nodes),
      );
      if (data) {
        this.redirecting('node-list');
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
      this.nodes.ip = '';
      this.nodes.nodeToken = '';
      this.nodes.port = '';
    },
  },
};
</script>
