<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="pa-4">
        {{ title }}
      </v-card-title>
      <v-divider></v-divider>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row>
              <v-col md="6" offset-md="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true, profileNameValidation: true }"
                  :name="$t('name')"
                >
                  <v-text-field
                    v-model.trim="protection.name"
                    color="primary"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('name')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <v-col cols="12" class="pt-0">
                <ProtectionAclInfo />
              </v-col>

              <!-- acl-country -->
              <v-col cols="12" md="6">
                <CountrySelect :acl-country.sync="protection.country" />
              </v-col>
              <!-- acl-cidr -->
              <v-col cols="12" md="6">
                <CidrSelect :cidr.sync="protection.cidr" />
              </v-col>
              <!-- acl-asn -->
              <v-col cols="12" md="6">
                <AsnSelect :asn.sync="protection.asn" />
              </v-col>
              <!-- acl-range-asn -->
              <v-col cols="12" md="6">
                <AsnRangeSelect :asn-range.sync="protection.asnRange" />
              </v-col>
              <v-col cols="12">
                <v-row
                  :class="
                    $vuetify.theme.dark
                      ? 'pt-4 pb-3 grey darken-3'
                      : 'pt-4 pb-3 grey lighten-3'
                  "
                >
                  <v-col cols="12" md="6" lg="6">
                    <ApiKeyForm
                      :api.sync="protection.apikey"
                      @readyList="apiesReceived"
                    />
                  </v-col>

                  <v-col v-if="editMood" cols="12" md="6" lg="6">
                    <ApikeyTable :tokens="changeEdit(protection.clientToken)" />
                  </v-col>
                  <v-col v-if="!editMood" cols="12" md="6" lg="6">
                    <ApikeyTable :tokens="tableViewToken" />
                  </v-col>
                </v-row>
              </v-col>
              <!-- configuration -->
              <v-col cols="12" class="pt-0">
                <ProtectionChallengeInfo />
              </v-col>
              <v-col cols="12">
                <v-row justify="center" align="center">
                  <v-col cols="12" md="5">
                    <ChallengeTypeSelect
                      :challenge-type.sync="protection.challenge"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <!-- START GENERAL  -->
              <v-col cols="12" md="4">
                <ProtectionDefaultLang
                  :default-lang.sync="protection.protectionDefaultLang"
                />
              </v-col>
              <v-col cols="12" md="4">
                <ProtectionSupportedLang
                  :value.sync="protection.protectionSupportedLang"
                />
              </v-col>
              <v-col v-if="protection.protectionSupportedLang" cols="12" md="4">
                <ProtectionI18nOrgTitle
                  :suggested-lang="protection.protectionSupportedLang"
                  :data-filler="protection.protectionI18nOrgTitle"
                  @orgI18n="orgI18nTitle"
                />
              </v-col>
              <!-- END GENERAL  -->
              <template
                v-if="protection.challenge && protection.challenge !== 'block'"
              >
                <v-col cols="12" md="4">
                  <ProtectionConfigTtl
                    :config-ttl.sync="protection.protectionConfigTtl"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <ProtectionConfigTimeout
                    :config-timeout.sync="protection.protectionConfigTimeout"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <ProtectionConfigWaitToSolve
                    :config-wait.sync="protection.protectionConfigWaitToSolve"
                  />
                </v-col>
              </template>

              <v-col
                v-if="
                  protection.challenge == 'captcha' ||
                  protection.challenge == 'ldap'
                "
                cols="12"
                md="4"
              >
                <CaptchaDifficultySelect
                  :captcha-difficult.sync="protection.captchaDifficulty"
                />
              </v-col>

              <v-col v-if="protection.challenge == 'totp'" cols="12">
                <TotpCmp @sendOtpSecret="receiveSecret" />
              </v-col>

              <!-- LDAP  -->
              <template v-if="protection.challenge == 'ldap'">
                <v-col cols="12" md="4">
                  <LdapGlobeCmp
                    :value.sync="protection.ldapUri"
                    :hint="$t('ldapUriHint')"
                    :label="$t('ldapUri')"
                    :rules="{ required: true, url: true }"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <LdapGlobeCmp
                    :value.sync="protection.ldapRoUsername"
                    :hint="$t('ldapRoUsernameHint')"
                    :label="$t('ldapRoUsername')"
                    :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <LdapGlobeCmp
                    :value.sync="protection.ldapRoPassword"
                    :hint="$t('ldapRoPasswordHint')"
                    :label="$t('ldapRoPassword')"
                    :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <LdapGlobeCmp
                    :value.sync="protection.ldapBaseDn"
                    :hint="$t('ldapBaseDnHint')"
                    :label="$t('ldapBaseDn')"
                    :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <LdapGlobeCmp
                    :value.sync="protection.ldapFilter"
                    :hint="$t('ldapFilterHint')"
                    :label="$t('ldapFilter')"
                    :rules="{ required: true }"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <LdapAttributes
                    :value="protection.ldapAttributes"
                    @input="ldapAttrMethod"
                  />
                </v-col>
              </template>
              <v-col v-if="editMood" cols="12" md="4" lg="2">
                <v-checkbox
                  v-model="protection.deleted"
                  :label="$t('remove')"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <!-- Action -->
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
                    @click.prevent="addProfile"
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
                    @click.prevent="editProfile"
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
  name: 'ProtectionForm',
  mixins: [routingFn],
  props: {
    oProtection: {
      type: Object,
      required: true,
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
      tableViewToken: {},
      isDisabled: false,
    };
  },
  computed: {
    protection: {
      get() {
        return this.oProtection;
      },
      set(v) {
        this.$emit('update:oProtection', v);
      },
    },
  },

  methods: {
    changeEdit(v) {
      const manipulateObj = { ...v };
      const c = Object.entries(manipulateObj).map(([name, token]) => ({
        name,
        token,
      }));
      return c;
    },
    orgI18nTitle(v) {
      this.$set(this.protection, 'protectionI18nOrgTitle', v);
    },
    ldapAttrMethod(v) {
      this.$set(this.protection, 'ldapAttributes', v);
    },
    receiveSecret(v) {
      this.$set(this.protection, 'totpSecret', v);
    },
    async addProfile() {
      const validity = await this.$refs.obs.validate();
      // check if protectionI18nOrgTitle exists in this.protection
      if (!this.protection.protectionI18nOrgTitle) {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'error',
          message: this.$t('protectionI18nOrgTitleRequired'),
          status: 'custom',
        });
        return;
      }

      if (!validity) {
        return;
      }

      this.isDisabled = true;
      const [err, data] = await to(
        this.$store.dispatch('protection/add/addProtection', this.protection),
      );

      if (data) {
        this.redirecting('protection-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }

      if (err) {
        this.errorCallback();
      }
    },
    async editProfile() {
      const cloned = { ...this.protection };

      Object.keys(cloned).forEach((key) => {
        if (cloned[key] === null || cloned[key] === []) {
          delete cloned[key];
        }
      });

      const [err, data] = await to(
        this.$store.dispatch('protection/edit/editProtection', cloned),
      );
      if (data) {
        this.redirecting('protection-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }

      if (err) {
        this.errorCallback();
      }
    },
    clear() {},

    apiesReceived(v) {
      this.tableViewToken = v;
      const clientToken = {};
      v.forEach((element) => {
        clientToken[element.name] = element.token;
      });
      this.protection.clientToken = clientToken;
    },

    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>
