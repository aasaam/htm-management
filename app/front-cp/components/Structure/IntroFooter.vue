<template>
  <v-footer
    app
    :dark="$vuetify.theme.dark"
    :fixed="$vuetify.breakpoint.lgAndUp ? true : false"
  >
    <v-row>
      <v-col>
        <span class="caption pr-4 pl-4">
          {{ $t('projectDescription') }}
        </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="d-flex justify-end">
        <LangSwitcher
          color="primary darken-4"
          icon-size="small"
          :btn-size="true"
        />
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'IntroFooter',
};
</script>
