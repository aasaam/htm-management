<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal white--text pa-4">
        {{ title }}
      </v-card-title>
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form novalidate="true" :disabled="isDisabled">
            <v-row class="pt-3">
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{ required: true, profileNameValidation: true }"
                  :name="$t('name')"
                >
                  <v-text-field
                    v-model.trim="innerAcl.name"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('profileName')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6" lg="5">
                <ValidationProvider
                  v-slot:default="{ errors }"
                  :rules="{ required: true }"
                  :name="$t('mood')"
                >
                  <v-radio-group
                    v-model="innerAcl.mood"
                    :error-messages="errors"
                    row
                  >
                    <v-radio :label="$t('whiteList')" :value="0"></v-radio>
                    <v-radio :label="$t('blackList')" :value="1"></v-radio>
                  </v-radio-group>
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" class="d-flex mt-3">
                    <v-icon>mdi-shield-off-outline</v-icon>
                    <span class="pl-3 pr-3 display-5">
                      {{ $t('aclDoc1') }}
                    </span>
                  </v-col>
                  <v-col cols="12" md="9">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      rules="required"
                      :name="$t('list')"
                    >
                      <v-textarea
                        v-model="innerList"
                        outlined
                        name="list"
                        :error-messages="errors"
                        :success="valid"
                        filled
                        persistent-hint
                        :hint="$t('aclListHint')"
                        dir="ltr"
                        :label="$t('list')"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="3">
                    <span class="font-weight-bold mb-2">
                      {{ $t('aclDoc2') }}
                    </span>

                    <div class="d-flex flex-column mb-6 mt-3">
                      <v-card
                        v-for="n in help"
                        :key="n"
                        class="pa-2"
                        outlined
                        tile
                      >
                        {{ n }}
                      </v-card>
                    </div>
                  </v-col>
                  <v-col v-if="editMood" cols="12" md="4" lg="2">
                    <v-checkbox
                      v-model="innerAcl.deleted"
                      :label="$t('remove')"
                    ></v-checkbox>
                  </v-col>
                </v-row>
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
                <template v-if="!editMood">
                  <v-btn
                    :disabled="isDisabled"
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="mb-3 mr-1 ml-1 pl-12 pr-12"
                    @click.prevent="addAcl"
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
                    @click.prevent="editAcl"
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
  name: 'AclForm',
  mixins: [routingFn],
  props: {
    title: {
      required: true,
      type: String,
    },
    // eslint-disable-next-line vue/require-default-prop
    acl: {
      required: false,
      type: Object,
    },
    ipList: {
      required: false,
      type: String,
      default: '',
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDisabled: false,
      help: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'],
    };
  },
  computed: {
    innerAcl: {
      cache: false,
      get() {
        return this.acl;
      },
      set(newValue) {
        this.$emit('update:acl', newValue);
      },
    },
    innerList: {
      cache: false,
      get() {
        return this.ipList;
      },
      set(newValue) {
        this.$emit('update:ipList', newValue);
      },
    },
  },
  methods: {
    async addAcl() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      this.isDisabled = true;
      const aclProfile = {};
      aclProfile.name = this.innerAcl.name;
      aclProfile.mood = this.innerAcl.mood;
      aclProfile.list = this.manipulateList(this.innerList);

      const [, data] = await to(
        this.$store.dispatch('acl/add/addAcl', aclProfile),
      );
      if (data) {
        this.redirecting('acl-list');

        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      } else {
        this.errorCallback();
      }
    },
    async editAcl() {
      this.isDisabled = true;
      const aclProfile = {};

      aclProfile.id = this.innerAcl.id;
      aclProfile.name = this.innerAcl.name;
      aclProfile.mood = this.innerAcl.mood;
      aclProfile.deleted = this.innerAcl.deleted;
      aclProfile.list = this.manipulateList(this.innerList);

      const [, data] = await to(
        this.$store.dispatch('acl/edit/editAcl', aclProfile),
      );

      if (data) {
        this.redirecting('acl-list');

        this.$nextTick(() => {
          this.clear();
          this.$refs.obs.reset();
        });
      } else {
        this.errorCallback();
      }
    },
    clear() {
      this.innerAcl.name = '';
      this.innerAcl.mood = null;
      this.innerList = '';
    },

    manipulateList(value) {
      const splitted = value.split('\n');
      // remove empty lines
      const filtered = splitted.filter(Boolean);
      const trimmed = filtered.map((line) => line.trim());
      const unique = [...new Set(trimmed)];
      return unique;
    },
  },
};
</script>
