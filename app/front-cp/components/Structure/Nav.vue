<template>
  <v-navigation-drawer
    v-model="drawerState"
    :right="dirMode"
    app
    clipped
    width="340px"
  >
    <v-sheet class="d-flex pa-4">
      <v-list-item-avatar size="48">
        <img src="_icons/logo.svg" :alt="$t('projectDescription')" />
      </v-list-item-avatar>
      <div class="pt-6">
        {{ $t('projectDescription') }}
      </div>
    </v-sheet>
    <v-divider></v-divider>
    <Menu />
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'Nav',
  computed: {
    dirMode() {
      return this.$vuetify.rtl;
    },
    drawerState: {
      get() {
        return this.$store.getters.drawerState;
      },
      set(v) {
        return this.$store.commit('TOGGLE_DRAWER_STATE', v);
      },
    },
  },
};
</script>
