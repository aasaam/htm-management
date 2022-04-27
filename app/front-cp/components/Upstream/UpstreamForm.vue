<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card flat>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <v-form novalidate="true" :disabled="isDisabled">
          <!-- ** servers ** -->
          <v-row justify="center" align="center">
            <v-col cols="12" class="mt-4 d-flex">
              <v-icon large>mdi-server</v-icon>
              <span class="pl-3 pr-3 text-h5 pt-1">
                {{ $t('addServerFields') }}
              </span>
              <v-btn
                x-small
                dark
                fab
                elevation="0"
                color="success"
                class="mt-1"
                @click.native="add"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <ValidationObserver ref="innerObs">
            <v-row
              v-for="(server, index) in upstream.serverList"
              :key="index"
              class="pt-8"
            >
              <!-- server -->
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: requiredF, upstreamServer: true }"
                  :name="$t('server')"
                >
                  <v-text-field
                    v-model.trim="server.server"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    persistent-hint
                    :hint="$t('serverHint')"
                    outlined
                    dir="ltr"
                    required
                    :label="$t('server')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <!-- port -->
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ port: true }"
                  :name="$t('port')"
                >
                  <v-text-field
                    v-model.trim="server.port"
                    color="light-blue darken-1"
                    type="number"
                    min="80"
                    :error-messages="errors"
                    :success="valid"
                    max="65535"
                    outlined
                    :label="$t('port')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <template
                v-if="upstream.serverList && upstream.serverList.length > 1"
              >
                <!-- weight -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="server.weight"
                    color="light-blue darken-1"
                    type="number"
                    min="1"
                    max="99"
                    :hint="$t('weightHint')"
                    outlined
                    :label="$t('weight')"
                    class="pb-3"
                  ></v-text-field>
                </v-col>
                <!-- maxConnection -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="server.maxConnection"
                    color="light-blue darken-1"
                    type="number"
                    persistent-hint
                    min="0"
                    :hint="$t('maxConnectionHint')"
                    outlined
                    :label="$t('maxConnection')"
                  ></v-text-field>
                </v-col>
                <!-- maxFails -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="server.maxFails"
                    type="number"
                    min="1"
                    persistent-hint
                    :hint="$t('maxFailsHint')"
                    outlined
                    :label="$t('maxFails')"
                  ></v-text-field>
                </v-col>
                <!-- failTimeout -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="server.failTimeout"
                    type="number"
                    persistent-hint
                    min="10"
                    :hint="$t('failTimeoutHint')"
                    outlined
                    :label="$t('failTimeout')"
                  ></v-text-field>
                </v-col>
                <!-- Backup -->
                <v-col cols="12" md="6" lg="3">
                  <v-checkbox
                    v-model="server.backup"
                    color="light-blue darken-1"
                    :value="false"
                    type="checkbox"
                    :label="$t('backup')"
                  ></v-checkbox>
                </v-col>
                <!-- down -->
                <v-col cols="12" md="6" lg="3">
                  <v-checkbox
                    v-model="server.down"
                    color="light-blue darken-1"
                    :value="false"
                    type="checkbox"
                    :label="$t('down')"
                  ></v-checkbox>
                </v-col>
              </template>

              <!-- delete -->
              <v-col cols="12" class="mb-4 d-flex justify-end align-end">
                <v-btn
                  small
                  dark
                  fab
                  elevation="0"
                  color="error"
                  class="mt-1"
                  @click="remove(index)"
                >
                  <v-icon> mdi-minus </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </ValidationObserver>
          <v-divider></v-divider>
          <!-- ** load balancer ** -->
          <v-row
            v-if="upstream.serverList.length > 1"
            justify="start"
            align="center"
          >
            <v-col cols="12" class="mt-4 d-flex pb-8">
              <v-icon large>mdi-ballot-outline</v-icon>
              <span class="pl-3 pr-3 text-h5">
                {{ $t('loadBalanceMethod') }}
              </span>
            </v-col>
            <v-col cols="12" md="6" lg="3">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{ required: requiredF }"
                :name="$t('method')"
              >
                <v-select
                  v-model="upstream.loadBalanceMethod"
                  :items="balancing"
                  outlined
                  :error-messages="errors"
                  :success="valid"
                  persistent-hint
                  item-text="name"
                  item-key="value"
                  :label="$t('chooseMethod')"
                  required
                ></v-select>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="upstream.keepalive"
                :hint="$t('keepaliveHint')"
                outlined
                min="8"
                persistent-hint
                :label="$t('keepalive')"
                type="number"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="upstream.keepaliveTime"
                outlined
                min="1"
                persistent-hint
                :hint="$t('keepaliveTimeHint')"
                :label="$t('keepaliveTime')"
                type="number"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="upstream.keepAliveRq"
                :hint="$t('keepaliveRequestHint')"
                outlined
                persistent-hint
                min="0"
                :label="$t('keepaliveRequest')"
                type="number"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="upstream.keepAliveTimeout"
                :hint="$t('keepAliveTimeoutHint')"
                outlined
                min="1"
                persistent-hint
                max="3600"
                :label="$t('keepaliveTimeout')"
                type="number"
              />
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'UpstreamForm',

  props: {
    // eslint-disable-next-line vue/require-default-prop
    oUpstream: {
      type: Object,
      required: false,
    },
    requiredF: {
      type: Boolean,
      required: true,
      // default: false,
    },
  },
  data() {
    return {
      isDisabled: false,
      balancing: [
        {
          name: this.$t('hashIp'),
          value: 'HI',
        },
        {
          name: this.$t('cookie'),
          value: 'CO',
        },
        {
          name: this.$t('roundRobin'),
          value: 'RR',
        },
      ],
    };
  },
  computed: {
    upstream: {
      get() {
        return this.oUpstream;
      },
      set(newValue) {
        this.$emit('update:oUpstream', newValue);
      },
    },
  },

  methods: {
    remove(index) {
      this.upstream.serverList.splice(index, 1);
    },
    async add() {
      const validity = await this.$refs.innerObs.validate();
      if (!validity) {
        return;
      }
      this.upstream.serverList.push({
        server: null,
        port: null,
        weight: null,
        maxConnection: null,
        maxFails: null,
        failTimeout: null,
        backup: null,
        down: null,
      });
    },
  },
};
</script>
