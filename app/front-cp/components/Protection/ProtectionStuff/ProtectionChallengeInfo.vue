<template>
  <div>
    <v-col cols="12" class="white--text d-flex mt-3 primary">
      <v-icon dark>mdi-cog</v-icon>
      <span class="pl-3 pr-3 text-h5">
        {{ $t('challengeConfiguration') }}
      </span>
      <v-spacer></v-spacer>
      <v-btn icon text dark @click="alert = !alert">
        <v-icon> mdi-arrow-down </v-icon>
      </v-btn>
    </v-col>
    <v-alert outlined color="primary" tile :value="alert">
      <div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="$t('protectionChallengeDescription')"></div>
      </div>
    </v-alert>
  </div>
</template>
<script>
export default {
  data() {
    return {
      alert: true,
    };
  },
};
</script>
