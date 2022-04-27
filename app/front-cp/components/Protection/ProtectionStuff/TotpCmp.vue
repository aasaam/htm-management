<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-alert prominent type="info">
        <v-row align="center">
          <v-col class="grow">
            {{ $t('totp_info') }}
          </v-col>
          <v-col class="shrink">
            <v-btn
              :disabled="isDisabled"
              dark
              large
              color="error"
              @click="generateQrcode()"
            >
              {{ $t('GenerateSecret') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-col>

    <v-col v-if="showCodeBox" cols="12" md="4" lg="3">
      <v-card
        v-if="imagePath"
        color="grey lighten-2"
        flat
        tile
        class="pt-10 pl-10 pr-10"
      >
        <v-img
          :aspect-ratio="16 / 9"
          contain
          :src="imagePath"
          class="text-center"
        ></v-img>
      </v-card>
      <v-alert dark type="info" color="grey darken-1" tile>
        <v-row align="center">
          <v-col class="grow"> {{ $t('remainTime') }} : </v-col>
          <v-col class="shrink">
            <v-btn
              dark
              small
              outlined
              :color="countDown < 30 ? 'error' : 'success'"
              class="mx-auto font-weight-medium"
            >
              <span class="white--text">
                {{ countDown }}
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import QRCode from 'qrcode';
const { to } = require('await-to-js');
export default {
  name: 'OtpCmp',
  data() {
    return {
      showCodeBox: false,
      countDown: 60,
      show: false,
      isDisabled: false,
      imagePath: '',
      tk: '',
    };
  },
  methods: {
    countDownTimer() {
      if (this.countDown > 1) {
        setTimeout(() => {
          this.countDown--;
          this.countDownTimer();
        }, 1000);
      } else {
        this.showCodeBox = false;
        this.countDown = 60;
      }
    },

    setNewOtpSecret(secret) {
      this.isDisabled = true;
      const uri = {
        title: 'HTMProtection',
        otpSecret: secret,
        host: window.location.hostname,
      };

      QRCode.toDataURL(
        `otpauth://totp/${uri.title}:${uri.host}?secret=${uri.secret}&issuer=${uri.title}`,
      )
        .then((url) => {
          this.imagePath = url;
          this.showCodeBox = true;
          this.countDownTimer();
          setTimeout(() => {
            this.showCodeBox = false;
            this.imagePath = '';
            this.isDisabled = false;
          }, 60000);
        })
        .catch((err) => {
          this.showCodeBox = false;
          this.isDisabled = false;
          this.imagePath = '';
          throw err;
        });
    },
    async generateQrcode() {
      this.isDisabled = true;

      const [err, secret] = await to(
        this.$store.dispatch('protection/add/otpGenerator'),
      );
      if (err) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 800);
        this.isDisabled = false;
      }
      if (secret) {
        // this.$emit('otpSecret', secret);
        this.setNewOtpSecret(secret);
      }
    },
  },
};
</script>
