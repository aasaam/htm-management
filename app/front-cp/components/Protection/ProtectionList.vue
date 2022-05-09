<template>
  <div>
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal accent-4 white--text pa-4">
        {{ $t(`${generalAction.title}`) }}
        <v-spacer />
        <v-btn
          v-if="!loginRole.includes('VI')"
          :to="localePath(`${generalAction.addLink}`)"
          nuxt
          color=""
        >
          {{ $t(`${generalAction.linkTitle}`) }}
        </v-btn>
      </v-card-title>

      <v-data-table
        mobile-breakpoint="960"
        class="pt-2 pb-2"
        :headers="headers"
        :items="dataList"
        :loading="loading"
        :server-items-length="total"
        :footer-props="{
          'items-per-page-options': [5, 10, 15],
          itemsPerPageText: $t('itemsPerPage'),
        }"
        :options.sync="options"
        :header-props="{ sortByText: `${$t('sortBy')}` }"
        @update:options="optionsChanged"
      >
        <template v-if="generalAction.deletable" v-slot:top>
          <ListDialog
            :dialog.sync="dialog"
            :title="$t('deleteProtectionProfile')"
            :okbtn="$t('deleteProtectionProfile')"
            :closebtn="$t('nope')"
            :done-event="deleteProtection"
            :loading="deleteLoading"
          >
            <template slot="dialogbody">
              <h3 class="mx-auto text-center pt-3 text-h6">
                {{ $t('areYouSureDelete') }}
              </h3>
              <div class="text-center mx-auto pt-5 pb-5">
                <span class="text-h6 primary--text">
                  {{ modalData.name }}
                </span>
              </div>
            </template>
          </ListDialog>
          <ShowConfDialog
            :dialog.sync="showConfigDialog"
            :title="$t('showConfig')"
            :data="dataCode"
          />
        </template>
        <template v-slot:[`body.prepend`]>
          <TableFilter :filter-type="headers" @sendReadyFilter="readyFilters" />
        </template>
        <template v-slot:[`item.deleted`]="{ item }">
          <v-chip
            v-if="item.deleted == true"
            dark
            small
            label
            class="ma-1"
            color="orange darken-4"
          >
            <span> {{ $t('deleted') }} </span>
          </v-chip>
          <v-chip
            v-if="item.deleted == false"
            dark
            small
            label
            class="ma-1"
            color="green darken-4"
          >
            <span> {{ $t('active') }} </span>
          </v-chip>
        </template>
        <template v-slot:[`item.challenge`]="{ item }">
          <span v-if="item.challenge === 'js'">
            {{ $t('challengeJs') }}
          </span>
          <span v-else-if="item.challenge === 'captcha'">
            {{ $t('challengeCaptcha') }}
          </span>
          <span v-else-if="item.challenge === 'totp'">
            {{ $t('challengeTotp') }}
          </span>
          <span v-else-if="item.challenge === 'ldap'">
            {{ $t('challengeLdap') }}
          </span>
          <span v-else-if="item.challenge === 'block'">
            {{ $t('challengeBlock') }}
          </span>
        </template>
        <!-- Action  -->
        <template v-slot:[`item.actions`]="{ item }">
          <nuxt-link
            v-if="!loginRole.includes('VI')"
            :to="localePath({ path: `${generalAction.editLink}/${item._id}` })"
            link
          >
            <v-icon text class="mr-1 ml-1"> mdi-pencil </v-icon>
          </nuxt-link>

          <v-icon
            v-if="!loginRole.includes('VI')"
            :disabled="item.deleted == true"
            tag="button"
            class="mr-1 ml-1"
            color="error"
            @click="deleteActionBtn(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            tag="button"
            class="mr-1 ml-1"
            color="primary"
            @click="forViewer(item)"
          >
            mdi-eye
          </v-icon>
        </template>
        <template v-slot:no-results>
          {{ $t('noResult') }}
        </template>
        <template v-slot:no-data>
          {{ $t('noResult') }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import listQueryBuilder from '@/mixin/listQueryBuilder';
const { to } = require('await-to-js');

export default {
  name: 'ProtectionTable',
  mixins: [listQueryBuilder],
  props: {
    generalAction: {
      type: Object,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    option: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loginRole: this.$store.getters['user/auth/GET_ROLE'],
      dataList: [],
      debounce: null,
      modalData: {},
      loading: false,
      deleteLoading: false,
      params: {},
      dialog: false,
      total: 0,
      options: this.option,
      // template
      dataCode: '',
      showConfigDialog: false,
    };
  },

  watch: {
    params: {
      handler(after, before) {
        if (this.debounce) {
          clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(() => {
          this.options.page = 1;
          this.options.itemsPerPage = 10;
          this.callMeFetch('protection/list/listProtection');
        }, 800);
      },
      deep: true,
    },
  },
  methods: {
    deleteActionBtn(data) {
      this.dialog = true;
      this.modalData = Object.assign({}, data);
    },
    async deleteProtection() {
      const { _id } = this.modalData;
      this.deleteLoading = true;

      const [err, data] = await to(
        this.$store.dispatch('protection/edit/deleteProtection', _id),
      );
      if (data) {
        this.deleteLoading = false;
        this.dialog = false;
        this.callMeFetch('protection/list/listProtection');
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 5000);
      }
      if (err) {
        this.deleteLoading = false;
        this.dialog = false;
      }
    },
    optionsChanged() {
      this.callMeFetch('protection/list/listProtection');
    },
    readyFilters(value) {
      this.params = value;
    },
    async forViewer(detail) {
      const id = detail._id;

      const [err, data] = await to(
        this.$store.dispatch('helper/generate', {
          type: 'protection',
          id,
        }),
      );
      if (data) {
        this.dataCode = data;
        this.showConfigDialog = true;
      }
      if (err) {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'red',
          message: `${err}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.prepend-filter {
  td {
    border-bottom: none !important;
  }
}
</style>
