<template>
  <ValidationObserver ref="obs">
    <Snackbar />

    <v-card class="mx-auto rounded-lg" elevation="12">
      <v-card-title
        class="primary lighten-1 text-center justify-center white--text"
      >
        {{ $t('login') }}
      </v-card-title>

      <v-card-text class="pb-12 mt-12">
        <v-row justify="center" align="center">
          <v-col cols="12" md="8" lg="9">
            <v-form
              novalidate="true"
              :disabled="isDisabled"
              @submit.prevent="onSubmit"
            >
              <v-row justify="center">
                <v-col class="mx-auto pb-0" cols="12">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :name="$t('email')"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model.trim="user.email"
                      :label="$t('email')"
                      type="text"
                      outlined
                      dir="ltr"
                      required
                      :error-messages="errors"
                      :success="valid"
                      prepend-inner-icon="mdi-email-outline"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" lg="6" class="pb-0">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :name="$t('password')"
                    :rules="`${user.otp.length > 0 ? '' : 'required'}`"
                  >
                    <v-text-field
                      v-model.trim="user.password"
                      :disabled="user.otp.length > 0 ? '' : disabled"
                      :error-messages="errors"
                      :success="valid"
                      :label="$t('password')"
                      :append-icon="pshow1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                      :type="pshow1 ? 'text' : 'password'"
                      outlined
                      small
                      prepend-inner-icon="mdi-lock"
                      @click:append="pshow1 = !pshow1"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" lg="6" class="pb-0">
                  <ValidationProvider
                    v-slot:default="{ errors, valid }"
                    :name="$t('otp')"
                    :rules="`${user.password.length > 0 ? '' : 'required'}`"
                  >
                    <v-text-field
                      v-model.trim="user.otp"
                      :disabled="user.password.length > 0 ? '' : disabled"
                      :label="$t('otpCode')"
                      :error-messages="errors"
                      :success="valid"
                      type="text"
                      outlined
                      small
                      prepend-inner-icon="mdi-lock-reset"
                      @click:append="oshow1 = !oshow1"
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>

              <v-card-actions class="mt-4 mx-auto text-center justify-center">
                <v-btn
                  type="submit"
                  x-large
                  color="red white--text"
                  class="pl-12 pr-12"
                >
                  {{ $t('login') }}
                  <v-icon small dark right class="pt-1">
                    mdi-arrow-{{ $vuetify.rtl ? 'left' : 'right' }}
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>

            <div class="mt-12 text-center caption">
              <nuxt-link
                :to="localePath('forgot_password')"
                class="text--lighten-5"
              >
                {{ $t('forgotPassword') }}
              </nuxt-link>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </ValidationObserver>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'Login',
  data() {
    return {
      authModel: '',
      user: {
        email: '',
        password: '',
        otp: '',
      },
      pshow1: false,
      isDisabled: false,
      show1: false,
      show2: false,
      disabled: false,
    };
  },

  mounted() {
    if (this.$store.state.user.auth.isLogin) {
      this.$router.push(
        this.localeRoute({
          name: 'dashboard',
        }),
      );
    }
  },
  methods: {
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }

      const info = {
        email: this.user.email,
      };
      if (this.user.otp.length > 0) {
        info.otp = this.user.otp;
      } else {
        info.password = this.user.password;
      }

      const [err, data] = await to(
        this.$store.dispatch('user/auth/signIn', info),
      );
      if (err) {
        this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 3300);
      }
      if (data) {
        this.isDisabled = true;
        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'dashboard',
            }),
          );
        }, 1000);
        this.$nextTick(() => {
          this.clearForm();
          this.$refs.obs.reset();
        });
      }
    },
    clearForm() {
      this.authModel = '';
      this.user.email = '';
      this.user.password = '';
      this.user.otp = '';
    },
  },
};
</script>
