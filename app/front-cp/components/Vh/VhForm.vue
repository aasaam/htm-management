<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card flat>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <v-form novalidate="true" :disabled="isDisabled">
          <!-- part 1 -->
          <v-row>
            <v-col cols="12" md="6" lg="6">
              <CertificateSelect
                :certificate.sync="vh.certificate"
                :required-f="requiredF"
              />
            </v-col>
          </v-row>
          <!-- part 2 -->
          <v-divider></v-divider>
          <!-- host  -->
          <VhAddHost :host.sync="vh.host" :required-f="requiredF" />
          <!-- server fields  -->
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <GlobalAutocomplete
                :data-list="wafmoodList"
                :model.sync="vh.wafMode"
                :label="$t('chooseWafMode')"
                :required="requiredF"
                :multiple="false"
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <ProtectProfileSelect
                :protection.sync="vh.protection"
                :required="requiredF"
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <PageSpeedSelect
                :pagespeed.sync="vh.pageSpeed"
                :required="requiredF"
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{ required: requiredF }"
                :name="$t('orgTitle')"
              >
                <v-text-field
                  v-model.trim="vh.orgTitle"
                  color="light-blue darken-1"
                  :error-messages="errors"
                  :success="valid"
                  type="text"
                  outlined
                  :label="$t('orgTitle')"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{ required: requiredF }"
                :name="$t('orgIcon')"
              >
                <v-text-field
                  v-model.trim="vh.orgIcon"
                  color="light-blue darken-1"
                  :error-messages="errors"
                  :success="valid"
                  type="text"
                  outlined
                  persistent-hint
                  :hint="$t('orgIconHint')"
                  :label="$t('orgIcon')"
                  append-icon="mdi-alert-box-outline"
                  @click:append="openSite"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <VhAgentSelector
                :o-agent.sync="vh.agentCheck"
                :required-f="requiredF"
              />
            </v-col>

            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model.number="vh.keepAliveRq"
                color="light-blue darken-1"
                type="number"
                min="0"
                max="1000000"
                persistent-hint
                outlined
                :hint="$t('serverKeepAliveRqHint')"
                :label="$t('keepAliveRq')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model.number="vh.keepAliveTimeout"
                color="light-blue darken-1"
                type="number"
                min="1"
                max="3600"
                outlined
                persistent-hint
                :hint="$t('serverKeepAliveTimeoutHint')"
                :label="$t('serverKeepAliveTimeout')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model.number="vh.requestPoolSize"
                color="light-blue darken-1"
                type="number"
                min="1"
                outlined
                persistent-hint
                :hint="$t('serverRequestPoolSizeHint')"
                :label="$t('serverRequestPoolSize')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model.number="vh.clientHeaderTimeout"
                color="light-blue darken-1"
                type="number"
                min="1"
                max="3600"
                persistent-hint
                outlined
                :hint="$t('serverClientHeaderTimeoutHint')"
                :label="$t('clientHeaderTimeout')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model.number="vh.clientHeaderBufferSize"
                color="light-blue darken-1"
                type="number"
                min="1"
                outlined
                persistent-hint
                :hint="$t('serverClientHeaderBufferSizeHint')"
                :label="$t('clientHeaderBufferSize')"
              ></v-text-field>
            </v-col>
            <!-- Large Client header buffer has tow option:  -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="vh.largeClientHeaderBufferSize"
                color="light-blue darken-1"
                type="number"
                min="1"
                persistent-hint
                outlined
                :hint="$t('serverLargeClientHeaderBufferSizeHint')"
                :label="$t('largeClientHeaderBufferSize')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="vh.largeClientHeaderBufferNumber"
                color="light-blue darken-1"
                type="number"
                min="1"
                outlined
                persistent-hint
                :hint="$t('serverLargeClientHeaderBufferNumberHint')"
                :label="$t('largeClientHeaderBufferNumber')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="3" class="pt-0 mb-3">
              <v-checkbox
                v-model="vh.alwaysServeHttp"
                :label="$t('alwaysServeHttps')"
              ></v-checkbox>
            </v-col>
          </v-row>
          <!-- ** location ** -->
          <v-divider></v-divider>
          <!-- START LOCATION  -->
          <v-row justify="center" align="center" class="mt-4">
            <v-col cols="12" class="d-flex mt-3">
              <v-icon x-large>mdi-city</v-icon>
              <span class="pl-3 pr-3 text-h5 pt-1">
                {{ $t('locationFields') }}
              </span>
              <v-btn
                x-small
                dark
                fab
                elevation="0"
                color="success"
                class="mt-1"
                @click.native="addLoc"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-for="(loc, i) in vh.location" :key="i + 1">
            <v-col cols="12">
              <v-btn class="ma-2" color="grey" disabled>
                {{ $t('location') }} {{ i + 1 }} :
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="3">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{ required: requiredF }"
                :name="$t('path')"
              >
                <v-text-field
                  v-model="loc.path"
                  color="light-blue darken-1"
                  :error-messages="errors"
                  :success="valid"
                  type="text"
                  dir="ltr"
                  outlined
                  :label="$t('path')"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6" lg="3">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{ required: requiredF }"
                :name="$t('locationType')"
              >
                <v-select
                  v-model="loc.locationType"
                  :items="modes"
                  outlined
                  :error-messages="errors"
                  :success="valid"
                  item-text="name"
                  item-key="value"
                  :label="$t('chooseType')"
                  required
                ></v-select>
              </ValidationProvider>
            </v-col>
            <!-- if redirect  -->
            <template v-if="loc.locationType == 'redirect'">
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: requiredF }"
                  :name="$t('status')"
                >
                  <v-select
                    v-model="loc.redirectStatus"
                    :items="statuses"
                    outlined
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('chooseStatus')"
                    required
                  ></v-select>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: requiredF, url: true }"
                  :name="$t('toUrl')"
                >
                  <v-text-field
                    v-model="loc.redirectToUrl"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    dir="ltr"
                    outlined
                    :label="$t('toUrl')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </template>
            <!-- if proxy  -->
            <template v-if="loc.locationType == 'proxy'">
              <v-col cols="12" md="6" lg="3">
                <UpstreamSelect
                  :upstream.sync="loc.upstreamProfile"
                  :required="requiredF"
                />
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true }"
                  :name="$t('schema')"
                >
                  <v-select
                    v-model="loc.proxySchema"
                    :items="proxySchemaList"
                    outlined
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('chooseSchema')"
                    required
                  ></v-select>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <v-text-field
                  v-model.number="loc.clientMaxBodySize"
                  color="light-blue darken-1"
                  type="number"
                  min="1"
                  persistent-hint
                  outlined
                  :hint="$t('clientMaxBodySizeHint')"
                  :label="$t('clientMaxBodySize')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="3">
                <v-text-field
                  v-model.number="loc.clientBodyBufferSize"
                  color="light-blue darken-1"
                  type="number"
                  min="10"
                  max="100"
                  persistent-hint
                  outlined
                  :hint="$t('clientBodyBufferSizeHint')"
                  :label="$t('clientBodyBufferSize')"
                ></v-text-field>
              </v-col>

              <v-col v-if="vh.wafMode !== 'disable'" cols="12" md="6" lg="3">
                <WafProfileSelect :waf.sync="loc.waf" :required="requiredF" />
              </v-col>

              <v-col cols="12" md="6" lg="3">
                <AclProfileSelect :acl.sync="loc.aclProfile" />
              </v-col>
              <v-col cols="12" md="6" lg="3" class="mt-0 pt-0">
                <v-checkbox
                  v-model="loc.activeProtection"
                  :label="$t('activeProtection')"
                  :value="false"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="6" lg="3" class="mt-0 pt-0">
                <v-checkbox
                  v-model="loc.standardCache"
                  :label="$t('standardCache')"
                  :value="false"
                ></v-checkbox>
              </v-col>
            </template>
            <!-- ##add header## -->
            <v-col v-if="loc.locationType == 'proxy'" cols="12" class="d-flex">
              <v-btn small dark color="blue" class="mt-1" @click="addHeader(i)">
                {{ $t('addHeader') }}
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row v-for="(he, j) in loc.headers" :key="j">
                <v-col cols="12" md="6" lg="3">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :rules="{ required: true }"
                    :name="$t('key')"
                  >
                    <v-text-field
                      v-model.trim="he.key"
                      color="light-blue darken-1"
                      :error-messages="errors"
                      :success="valid"
                      type="text"
                      outlined
                      :label="$t('key')"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6" lg="3">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :rules="{ required: true }"
                    :name="$t('value')"
                  >
                    <v-text-field
                      v-model.trim="he.value"
                      color="light-blue darken-1"
                      :error-messages="errors"
                      :success="valid"
                      type="text"
                      outlined
                      :label="$t('value')"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-col>
            <!-- ##add proxy header## -->
            <v-col v-if="loc.locationType == 'proxy'" cols="12" class="d-flex">
              <v-btn
                small
                dark
                color="blue"
                class="mt-1"
                @click="addProxyHeader(i)"
              >
                {{ $t('addProxyHeader') }}
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row v-for="(he, j) in loc.proxyHeaders" :key="j">
                <v-col cols="12" md="6" lg="3">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :rules="{ required: true }"
                    :name="$t('key')"
                  >
                    <v-text-field
                      v-model.trim="he.key"
                      color="light-blue darken-1"
                      :error-messages="errors"
                      :success="valid"
                      type="text"
                      outlined
                      :label="$t('key')"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6" lg="3">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :rules="{ required: true }"
                    :name="$t('value')"
                  >
                    <v-text-field
                      v-model.trim="he.value"
                      color="light-blue darken-1"
                      :error-messages="errors"
                      :success="valid"
                      type="text"
                      outlined
                      :label="$t('value')"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- END LOCATION  -->
        </v-form>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'VhForm',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    ovh: {
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
      modes: [
        {
          name: this.$t('redirect'),
          value: 'redirect',
        },
        {
          name: this.$t('proxy'),
          value: 'proxy',
        },
      ],
      statuses: ['301', '302'],
      proxySchemaList: ['http', 'https'],
      wafmoodList: ['disable', 'learning', 'debug', 'active'],
    };
  },
  computed: {
    vh: {
      get() {
        return this.ovh;
      },
      set(newValue) {
        this.$emit('update:ovh', newValue);
      },
    },
  },
  methods: {
    openSite() {
      window.open('https://aasaam.github.io/brand-icons/#icons', '_blank');
    },

    addLoc() {
      this.vh.location.push({
        headers: [],
        proxyHeaders: [],
      });
    },
    addHeader(index) {
      this.vh.location[index].headers.push({
        key: '',
        value: '',
      });
    },
    addProxyHeader(index) {
      this.vh.location[index].proxyHeaders.push({
        key: '',
        value: '',
      });
    },

    updateProtocol(value) {
      this.vh.protocol = value;
    },
    updateCertificate(value) {
      this.vh.certificate = value;
    },
  },
};
</script>
