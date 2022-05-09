<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal accent-4 white--text pa-4">
        {{ title }}
        <v-spacer></v-spacer>
      </v-card-title>
      <!-- Form -->
      <div :class="$vuetify.breakpoint.sm ? 'pa-2' : 'pa-5'">
        <ValidationObserver ref="obs">
          <v-form
            novalidate="true"
            :disabled="isDisabled"
            @submit.prevent="onSubmit"
          >
            <v-row class="pt-3">
              <v-col cols="12" md="6" lg="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required|email"
                  :name="$t('email')"
                >
                  <v-text-field
                    v-model.trim="user.email"
                    :error-messages="errors"
                    :success="valid"
                    dir="ltr"
                    type="text"
                    outlined
                    required
                    :label="$t('email')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{
                    required: true,
                    min: 8,
                  }"
                  :name="$t('password')"
                  vid="passw"
                >
                  <v-text-field
                    v-model="user.password"
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('password')"
                    :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                    :type="show ? 'text' : 'password'"
                    outlined
                    prepend-inner-icon="mdi-lock-outline"
                    @click:append="show = !show"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="3">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :name="`${$t('repeatPassword')}`"
                  rules="required|passwordcnf:@passw"
                >
                  <v-text-field
                    v-model="confirmation"
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('repeatPassword')"
                    :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                    outlined
                    required
                    :type="show1 ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    @click:append="show1 = !show1"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12" md="6" lg="3">
                <GlobalAutocomplete
                  :data-list="roleList"
                  :multiple="true"
                  :model.sync="user.roles"
                  :required="true"
                  :label="$t('chooseRole')"
                />
              </v-col>
              <v-col cols="12" md="4" lg="2">
                <v-checkbox
                  v-model="user.active"
                  :label="$t('active')"
                  :false-value="false"
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
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="primary white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                >
                  {{ title }}
                </v-btn>
                <v-btn
                  x-large
                  color="warning white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click="clearForm"
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
  name: 'UserForm',
  mixins: [routingFn],
  props: {
    title: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      roleList: [
        {
          name: this.$t('superAdmin'),
          value: 'SA',
        },
        {
          name: this.$t('admin'),
          value: 'AD',
        },
        {
          name: this.$t('viewer'),
          value: 'VI',
        },
      ],
      confirmation: '',
      show: false,
      show1: false,
      isDisabled: false,
      user: {
        active: true,
      },
    };
  },
  methods: {
    async onSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/add/addUser', this.user),
      );

      if (data) {
        this.redirecting('user-list');
        this.$nextTick(() => {
          this.clearForm();
          this.$refs.obs.reset();
        });
      }

      if (err) {
        this.errorCallback();
      }
    },

    clearForm() {
      this.user.email = '';
      this.user.active = true;
      this.user.password = '';
      this.confirmation = '';
      this.user.roles = [];
      this.$nextTick(() => {
        this.$refs.obs.reset();
      });
    },
  },
};
</script>
