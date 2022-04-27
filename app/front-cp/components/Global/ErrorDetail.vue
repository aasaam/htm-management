<template>
  <div class="pa-12 mt-8">
    <h1 class="block mx-auto text-center text-h1 font-weight-medium">
      {{ status }}
    </h1>
    <h2 class="block mx-auto text-center text-h5 pt-10">
      {{ $t('oops') }}
    </h2>
    <h3 class="block mx-auto text-center text-h4 pt-9">
      {{ guideMessage }}
    </h3>

    <div class="d-flex mx-auto pt-10">
      <v-btn
        class="d-flex mx-auto"
        color="warning"
        :to="localePath('index')"
        nuxt
        x-large
      >
        {{ $t('goBack') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: null,
    },
    guideMessage: {
      type: String,
      default: null,
    },
  },
};
</script>
