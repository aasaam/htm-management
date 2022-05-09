<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8" lg="9">
      <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
        <v-tabs
          v-model="tab"
          background-color="teal accent-4 font-weight-light"
          centered
          dark
          color="white"
          :grow="$vuetify.breakpoint.smAndDown ? true : false"
          :fixed-tabs="$vuetify.breakpoint.mdAndUp ? true : false"
          :icons-and-text="$vuetify.breakpoint.mdAndUp"
          slider-size="4"
          show-arrows
        >
          <v-tabs-slider color="amber darken-3"></v-tabs-slider>

          <v-tab href="#tab-2" class="pb-2">
            {{ $t('editData') }}
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab href="#tab-3" class="pb-2">
            {{ $t('editPassword') }}
            <v-icon>mdi-key-plus</v-icon>
          </v-tab>
          <v-tab href="#tab-4" class="pb-2">
            {{ $t('totpSetting') }}
            <v-icon>mdi-account-key</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="pt-8">
          <v-tab-item value="tab-2">
            <EditMainData :user-data="dataPAss" />
          </v-tab-item>
          <v-tab-item value="tab-3">
            <LazyEditPassword :user-id="dataPAss.id" />
          </v-tab-item>

          <v-tab-item value="tab-4">
            <OtpActivate :user-id="dataPAss.id" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { to } from 'await-to-js';

export default {
  name: 'UserEditSnapshot',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dataPAss: {},
      tab: null,
      isActivetab2: false,
      isActivetab3: false,
    };
  },
  async mounted() {
    // if (this.id) {
    //   const result = await this.$store.dispatch(
    //     'user/profile/singleUser',
    //     this.id,
    //   );
    //   this.dataPAss = { ...result };
    // }
    if (this.id) {
      const [err, result] = await to(
        this.$store.dispatch('user/profile/singleUser', this.id),
      );
      if (result) {
        this.dataPAss = { ...result };
      }
      if (err) {
        return this.$nuxt.error({
          statusCode: err['0'].extensions.code,
        });
      }
    }
  },
};
</script>
