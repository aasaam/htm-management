<template>
  <div class="mx-auto text-center justify-center">
    <Snackbar />
    <ValidationObserver ref="obs">
      <v-card class="mx-auto rounded-lg" elevation="12">
        <v-card-title
          class="primary lighten-1 text-center justify-center white--text"
        >
          {{ $t('forgot_password') }}
        </v-card-title>

        <v-card-text class="pb-12 mt-8">
          <v-row justify="center" align="center">
            <v-col cols="12" lg="8">
              <v-form
                novalidate="true"
                :disabled="isDisabled"
                class="pt-8"
                @submit.prevent="onSubmit"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12">
                    <p>{{ $t('enterEmail') }}</p>
                  </v-col>
                  <v-col class="mx-auto" cols="12">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      :name="`${$t('email')}`"
                      rules="required|email"
                    >
                      <v-text-field
                        v-model.trim="user.email"
                        :error-messages="errors"
                        :success="valid"
                        :label="$t('email')"
                        type="email"
                        dir="ltr"
                        outlined
                        required
                        prepend-inner-icon="mdi-email-outline"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>

                <v-card-actions class="mt-6 mx-auto text-center justify-center">
                  <v-btn
                    type="submit"
                    x-large
                    color="primary white--text"
                    class="pl-12 pr-12"
                  >
                    {{ $t('sendMeCode') }}
                  </v-btn>
                  <v-btn
                    type="submit"
                    x-large
                    color="warning white--text"
                    class="pl-12 pr-12"
                    :to="localePath('/')"
                  >
                    {{ $t('back') }}
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
  name: 'ForgotPassword',
  data() {
    return {
      isDisabled: false,
      user: {
        email: '',
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
        this.$store.dispatch(
          'user/forgetPassword/forgotPasswordCode',
          this.user,
        ),
      );

      if (err) {
        this.isDisabled = false;

        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 2000);
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
      }

      if (data) {
        this.isDisabled = true;
        this.$router.push(
          this.localeRoute({
            name: 'recover_password',
          }),
        );
      }
    },
  },
};
</script>
