<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal accent-4 white--text pa-4">
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn color="warning" class="white--text" @click.stop="dialog = true">
          {{ $t('docs') }}
          <v-icon right dark> mdi-file-document-outline </v-icon>
        </v-btn>
      </v-card-title>
      <!-- Help -->
      <WafDocs :dialog.sync="dialog" />
      <!-- Help -->
      <WafRuleGenerator
        :dialog.sync="dialog2"
        :index="i"
        @pasteRule="pasteRule"
      />
      <!-- Form -->
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row class="pt-3">
              <v-col cols="12" md="4" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required|profileNameValidation"
                  :name="$t('profileName')"
                >
                  <v-text-field
                    v-model.trim="inWaf.profileName"
                    color="primary"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('profileName')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
                <v-row justify="center" align="center">
                  <v-col cols="12" class="d-flex mt-3">
                    <v-icon>mdi-shield-off-outline</v-icon>
                    <span class="pl-3 pr-3 display-5">
                      {{ $t('addWhiteListRules') }}
                    </span>
                  </v-col>
                </v-row>
                <!-- form  -->
                <v-row v-for="(rule, index) in waf.list" :key="index">
                  <v-col cols="12" md="6" lg="3">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      rules="required|alpha_dash"
                      :name="$t('name')"
                    >
                      <v-text-field
                        v-model.trim="rule.name"
                        color="primary"
                        :error-messages="errors"
                        :success="valid"
                        type="text"
                        :hint="$t('wafNameHint')"
                        outlined
                        :label="$t('name')"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6" lg="4">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      rules="required"
                      :name="$t('rule')"
                    >
                      <v-text-field
                        v-model="rule.rule"
                        color="primary"
                        :error-messages="errors"
                        :success="valid"
                        type="text"
                        outlined
                        :hint="$t('wafRuleHint')"
                        dir="ltr"
                        persistent-hint
                        :label="$t('rule')"
                        class="forceLtr"
                      >
                        <template v-slot:append-outer>
                          <v-btn
                            x-small
                            color="primary"
                            class="white--text"
                            @click.stop="openDialog(index)"
                          >
                            <v-icon small dark> mdi-plus </v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6" lg="4">
                    <v-text-field
                      v-model.trim="rule.description"
                      color="primary"
                      type="text"
                      outlined
                      :label="$t('description')"
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <v-btn
                      small
                      dark
                      fab
                      elevation="0"
                      color="success"
                      class="mt-1"
                      @click="addRow"
                    >
                      <v-icon> mdi-plus </v-icon>
                    </v-btn>
                    <v-btn
                      v-show="(waf.list.length > 1) & (index > 0)"
                      small
                      dark
                      fab
                      elevation="0"
                      color="error"
                      class="ml-1 mt-1"
                      @click.native="deleteRow(index)"
                    >
                      <v-icon> mdi-minus </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="editMood" cols="12" md="4" lg="2">
                <v-checkbox
                  v-model="inWaf.deleted"
                  :label="$t('remove')"
                ></v-checkbox>
              </v-col>
              <!-- actions -->
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
                    @click.prevent="addWaf"
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
                    @click.prevent="editWaf"
                  >
                    {{ title }}
                  </v-btn>
                </template>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
        <!-- <pre>BasicRule wl:{{ waf.wl }} "mz:{{ waf.mz }}"</pre> -->
        <!-- <pre>{{ waf }}</pre> -->
      </div>
    </v-card>
  </div>
</template>

<script>
import { to } from 'await-to-js';
import routingFn from '@/mixin/routingFn';

export default {
  name: 'WafForm',
  mixins: [routingFn],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    waf: {
      type: Object,
      required: false,
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
      loginRole: this.$store.getters['user/auth/GET_ROLE'],
      i: 0,
      dialog: false,
      dialog2: false,
      isDisabled: false,
    };
  },
  computed: {
    inWaf: {
      get() {
        return this.waf;
      },
      set(value) {
        this.$emit('update:waf', value);
      },
    },
  },

  methods: {
    async addRow() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      this.inWaf.list.push({
        name: '',
        rule: '',
        description: '',
      });
    },
    deleteRow(index) {
      this.inWaf.list.splice(index, 1);
    },
    openDialog(index) {
      this.dialog2 = true;
      this.i = index;
    },
    pasteRule(rule, b) {
      const c = this.waf.list[b];
      c.rule = rule;
    },
    clear() {
      this.inWaf.profileName = '';
      this.waf.list.forEach((element) => {
        element.name = '';
        element.rule = '';
        element.description = '';
      });
      this.$refs.obs.reset();
    },
    async addWaf() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;

      const [err, data] = await to(
        this.$store.dispatch('waf/add/addWaf', this.waf),
      );

      if (data) {
        this.redirecting('waf-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }
      if (err) {
        this.errorCallback();
      }
    },

    async editWaf() {
      this.isDisabled = true;
      const wafP = {};
      wafP.id = this.waf._id;
      wafP.profileName = this.waf.profileName;
      wafP.list = this.waf.list;
      wafP.deleted = this.waf.deleted;

      const [err, data] = await to(
        this.$store.dispatch('waf/edit/editWaf', wafP),
      );
      if (data) {
        this.redirecting('waf-list');
        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      }
      if (err) {
        this.errorCallback();
      }
    },
  },
};
</script>
<style lang="scss">
.forceLtr {
  .v-messages__message {
    direction: ltr !important;
  }
}
</style>
