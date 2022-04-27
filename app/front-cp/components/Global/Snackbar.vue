<template>
  <v-snackbar
    v-model="snackbar.show"
    transition="scroll-y-transition"
    :color="snackbar.color"
    timeout="-1"
    top="top"
    multi-line
  >
    <span v-if="snackbar && snackbar.statusText">
      <pre>{{ snackbar.statusText }}</pre>
      {{ $t('errors.OTHER_ERROR') }}
    </span>
    <template v-if="snackbar.status === 'restError'">
      {{ snackbar.message.status }} - {{ snackbar.message.message }}
    </template>
    <template v-if="snackbar.status === 'success'">
      {{ $t(`success.${snackbar.message}`) }}
    </template>
    <template v-if="snackbar.status === 'custom'">
      {{ snackbar.message }}
    </template>

    <template v-if="snackbar.status === 'error'">
      <p class="font-weight-bold text-center">
        <span v-if="snackbar.message[0].message === 'UNPROCESSABLE_ENTITY'">
          {{ $t('errors.UNPROCESSABLE_ENTITY') }}
        </span>
        <span v-if="snackbar.message[0].message === 'DUPLICATE_ENTRY'">
          {{ $t('errors.DUPLICATE_ENTRY') }}
        </span>
      </p>
      <template
        v-if="
          snackbar.message[0] &&
          snackbar.message[0].extensions &&
          snackbar.message[0].extensions.validation
        "
      >
        <ul>
          <li
            v-for="(e, i) in snackbar.message[0].extensions.validation"
            :key="i"
          >
            {{ $t(`errors.${e.message}`) }} => {{ e.field }}
          </li>
        </ul>
      </template>
      <template v-else>
        {{ snackbar.message[0].message }}
      </template>
    </template>

    <template v-slot:[`item.action`]="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="$store.commit('CLOSE_NOTIFICATION', !snackbar.show)"
      >
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'Snackbar',

  computed: {
    ...mapState({
      snackbar: (state) => state.snackbar,
    }),
  },
  beforeCreate() {
    this.$store.commit('CLOSE_NOTIFICATION', false);
  },
  created() {
    this.$store.commit('SET_NOTIFICATION', {
      message: '',
      show: false,
    });
  },
};
</script>
