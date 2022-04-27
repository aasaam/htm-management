<template>
  <div>
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="teal white--text pa-4">
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
            :title="$t('deleteWaf')"
            :okbtn="$t('deleteWaf')"
            :closebtn="$t('nope')"
            :done-event="deleteWaf"
            :loading="deleteLoading"
          >
            <template slot="dialogbody">
              <h3 class="text-h6 mx-auto text-center pt-3">
                {{ $t('areYouSureDelete') }}
              </h3>
              <div class="text-center mx-auto pt-5 pb-5">
                <span class="text-h6 primary--text">
                  {{ modalData.profileName }}
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
        <template v-slot:[`item.pageSpeed`]="{ item }">
          <v-chip
            v-if="item.pageSpeed == 0"
            dark
            small
            label
            class="ma-1"
            color="warning"
          >
            No
          </v-chip>
          <v-chip
            v-if="item.pageSpeed == 1"
            dark
            label
            small
            class="ma-1"
            color="success"
          >
            Yes
          </v-chip>
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
            color="info"
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
  name: 'WafTable',
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
          this.callMeFetch('waf/list/listWaf');
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
    async deleteWaf() {
      const { _id } = this.modalData;
      this.deleteLoading = true;

      const [err, data] = await to(
        this.$store.dispatch('waf/edit/deleteWaf', _id),
      );
      if (data) {
        this.deleteLoading = false;
        this.dialog = false;
        this.callMeFetch('waf/list/listWaf');
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
      this.callMeFetch('waf/list/listWaf');
    },
    readyFilters(value) {
      this.params = value;
    },
    async forViewer(detail) {
      const id = detail._id;
      const result = await this.$store.dispatch('waf/list/singleWaf', id);
      if (result) {
        const [err, data] = await to(
          this.$store.dispatch('helper/generate', {
            type: 'waf',
            dataModel: result,
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
