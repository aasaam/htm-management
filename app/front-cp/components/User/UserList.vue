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
            :title="$t('deleteUser')"
            :okbtn="$t('deleteUser')"
            :closebtn="$t('nope')"
            :done-event="deleteUser"
            :loading="deleteLoading"
          >
            <template slot="dialogbody">
              <h3 class="text-h6 mx-auto text-center pt-3">
                {{ $t('areYouSureDelete') }}
              </h3>
              <div class="text-center mx-auto pt-5 pb-5">
                <span class="text-h6 primary--text">
                  {{ modalData.email }}
                </span>
              </div>
            </template>
          </ListDialog>
        </template>
        <template v-slot:[`body.prepend`]>
          <TableFilter :filter-type="headers" @sendReadyFilter="readyFilters" />
        </template>
        <template v-slot:[`item.roles`]="{ item }">
          <v-chip
            v-for="(i, j) in item.roles"
            :key="j"
            dark
            small
            label
            class="ma-1"
            color="cyan darken-3"
          >
            <span v-if="i == 'AD'">
              {{ $t('admin') }}
            </span>
            <span v-if="i == 'SA'">
              {{ $t('superAdmin') }}
            </span>
            <span v-if="i == 'VI'">
              {{ $t('viewer') }}
            </span>
          </v-chip>
        </template>
        <template v-slot:[`item.lastLogin`]="{ item }">
          <span v-if="item.lastLogin">
            {{ formatDateTime({ value: item.lastLogin }) }}
          </span>
          <span v-else>
            {{ $t('notLoggedIn') }}
          </span>
        </template>
        <template v-slot:[`item.active`]="{ item }">
          <v-chip
            v-if="item.active == true"
            dark
            small
            label
            class="ma-1"
            color="green darken-2"
          >
            {{ $t('active') }}
          </v-chip>
          <v-chip
            v-if="item.active == false"
            dark
            small
            label
            class="ma-1"
            color="black darken-2"
          >
            {{ $t('inactive') }}
          </v-chip>
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
          <nuxt-link
            v-if="loginRole.includes('VI')"
            :to="localePath({ path: `${generalAction.editLink}/${item._id}` })"
            link
          >
            <v-icon text class="mr-1 ml-1"> mdi-eye </v-icon>
          </nuxt-link>

          <template v-if="!loginRole.includes('VI')">
            <v-icon
              v-if="generalAction.deletable"
              :disabled="item.deleted == true"
              tag="button"
              class="mr-1 ml-1"
              color="error"
              @click="deleteActionBtn(item)"
            >
              mdi-delete
            </v-icon>
          </template>
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
import dateFormatter from '@/mixin/dateFormatter';
import listQueryBuilder from '@/mixin/listQueryBuilder';
const { to } = require('await-to-js');

export default {
  name: 'UserTable',
  mixins: [listQueryBuilder, dateFormatter],
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
          this.callMeFetch('user/list/listUser');
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
    async deleteUser() {
      const { _id } = this.modalData;
      this.deleteLoading = true;

      const [err, data] = await to(
        this.$store.dispatch('user/delete/deleteUser', _id),
      );
      if (data) {
        this.deleteLoading = false;
        this.dialog = false;
        this.callMeFetch('user/list/listUser');
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
      this.callMeFetch('user/list/listUser');
    },
    readyFilters(value) {
      this.params = value;
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
