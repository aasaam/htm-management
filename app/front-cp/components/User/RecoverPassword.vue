<template>
  <div class="mx-auto text-center justify-center">
    <Snackbar />
    <ValidationObserver ref="obs">
      <v-card
        class="mx-auto rounded-lg"
        :elevation="$vuetify.theme.dark ? 9 : 8"
      >
        <v-card-title
          class="primary lighten-1 text-center justify-center white--text"
        >
          {{ $t('resetPassword') }}
        </v-card-title>
        <v-card-title class="text-center justify-center py-6 caption d-flex">
          <p class="grey--text">
            {{ $t('enterRecoverCode') }}
          </p>
          <nuxt-link
            :to="localePath('forgot_password')"
            class="d-flex text--darken-3 caption d-flex pb-4 pr-3 pl-3"
          >
            {{ $t('resendCode') }}
          </nuxt-link>
        </v-card-title>

        <v-card-text class="pb-12">
          <v-row justify="center" align="center">
            <v-col cols="12" lg="9">
              <v-form
                novalidate="true"
                class="pt-8"
                :disabled="isDisabled"
                @submit.prevent="handleSubmit"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12" class="mb-0 pb-0">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      :name="$t('code')"
                      rules="required"
                    >
                      <v-text-field
                        v-model.trim="user.token"
                        :error-messages="errors"
                        :label="$t('code')"
                        :success="valid"
                        type="text"
                        outlined
                        dir="ltr"
                        required
                        prepend-inner-icon="mdi-lock-question"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12">
                    <v-row v-if="user.token" justify="center">
                      <v-col cols="12" md="6">
                        <ValidationProvider
                          v-slot:default="{ errors, valid }"
                          rules="required|min:8"
                          :name="$t('password')"
                          vid="passw"
                        >
                          <v-text-field
                            v-model="user.password"
                            :error-messages="errors"
                            :success="valid"
                            :label="$t('newPassword')"
                            :append-icon="
                              show ? 'mdi-eye-off-outline' : 'mdi-eye'
                            "
                            :type="show ? 'text' : 'password'"
                            outlined
                            prepend-inner-icon="mdi-lock-outline"
                            @click:append="show = !show"
                          />
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" md="6">
                        <ValidationProvider
                          v-slot:default="{ errors, valid }"
                          :name="$t('repeatPassword')"
                          rules="required|passwordcnf:@passw"
                        >
                          <v-text-field
                            v-model="confirmation"
                            :error-messages="errors"
                            :success="valid"
                            :label="$t('repeatPassword')"
                            :append-icon="
                              show1 ? 'mdi-eye-off-outline' : 'mdi-eye'
                            "
                            outlined
                            required
                            :type="show1 ? 'text' : 'password'"
                            prepend-inner-icon="mdi-lock-outline"
                            @click:append="show1 = !show1"
                          />
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-card-actions
                  class="mt-10 mx-auto text-center justify-center"
                >
                  <v-btn
                    type="submit"
                    x-large
                    :disabled="isDisabled"
                    color="primary white--text"
                    class="pl-12 pr-12"
                  >
                    {{ $t('changePassword') }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'RecoverPassword',

  data() {
    return {
      isDisabled: false,
      user: {
        token: '',
        password: '',
      },
      confirmation: '',
      show: false,
      show1: false,
    };
  },

  methods: {
    async handleSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/forgetPassword/resetPassword', this.user),
      );

      if (err) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
          this.isDisabled = false;
          this.user.password = '';
          this.confirmation = '';
        }, 1800);
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
      }
      if (data) {
        this.isDisabled = true;
        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'index',
            }),
          );
        }, 2000);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v-application .elevation-12 {
  box-shadow: 0px 7px 8px -4px rgba(91, 91, 91, 0.2),
    0px 12px 17px 2px rgba(0, 0, 0, 0.14),
    0px 5px 22px 4px rgba(181, 180, 180, 0.12) !important;
}
.border-rad {
  border-radius: 35px !important;
}
</style>
