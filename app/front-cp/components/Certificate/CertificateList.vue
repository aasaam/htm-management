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
        :item-class="row_classes"
        :loading="loading"
        :server-items-length="total"
        :footer-props="{
          'items-per-page-options': [5, 10, 15],
          itemsPerPageText: $t('itemsPerPage'),
        }"
        :options.sync="options"
        :header-props="{ sortByText: $t('sortBy') }"
        @update:options="optionsChanged"
      >
        <template v-if="generalAction.deletable" v-slot:top>
          <ListDialog
            :dialog.sync="dialog"
            :title="$t('deleteCertificate')"
            :okbtn="$t('deleteCertificate')"
            :closebtn="$t('nope')"
            :done-event="deleteCert"
            :loading="deleteLoading"
          >
            <template slot="dialogbody">
              <h3 class="text-h6 mx-auto text-center pt-3">
                {{ $t('areYouSureDelete') }}
              </h3>
              <div class="text-center mx-auto pt-5 pb-5">
                <span class="text-h6 primary--text">
                  {{ modalData.name }}
                </span>
              </div>
            </template>
          </ListDialog>
        </template>
        <template v-slot:[`body.prepend`]>
          <TableFilter :filter-type="headers" @sendReadyFilter="readyFilters" />
        </template>
        <template v-slot:[`item.sans`]="{ item }">
          <v-chip
            v-for="(i, j) in item.sans"
            :key="j"
            dark
            small
            label
            class="ma-1"
            color="grey darken-3"
          >
            {{ i }}
          </v-chip>
        </template>
        <template v-slot:[`item.notAfter`]="{ item }">
          {{ item.notAfter }} ( {{ formatDateTime({ value: item.notAfter }) }})
          <!-- calc how many days left -->
          <v-chip small label class="ml-1 mr-1">
            {{ diffDateTime({ value: item.notAfter }) }}
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
        <template
          v-if="!loginRole.includes('VI')"
          v-slot:[`item.actions`]="{ item }"
        >
          <nuxt-link
            :to="localePath({ path: `${generalAction.editLink}/${item._id}` })"
            link
          >
            <v-icon text class="mr-1 ml-1"> mdi-pencil </v-icon>
          </nuxt-link>

          <v-icon
            v-if="generalAction.deletable"
            :disabled="item.deleted == true"
            tag="button"
            class="mr-1 ml-1"
            color="error darken-4"
            @click="deleteActionBtn(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-results>
          {{ $t('noResult') }}
        </template>
        <template v-slot:no-data>
          {{ $t('noData') }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import listQueryBuilder from '@/mixin/listQueryBuilder';
import dateFormatter from '@/mixin/dateFormatter';
const { to } = require('await-to-js');

export default {
  name: 'CertificateTable',
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
          this.callMeFetch('certificate/list/listCert');
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
    row_classes(item) {
      const expDate = new Date(item.notAfter).toISOString();
      const date = new Date().toISOString();

      if (expDate <= date) {
        return 'error lighten-1  white--text';
      }
    },
    async deleteCert() {
      const { _id } = this.modalData;
      this.deleteLoading = true;

      const [err, data] = await to(
        this.$store.dispatch('certificate/edit/deleteCert', _id),
      );
      if (data) {
        this.deleteLoading = false;
        this.dialog = false;
        this.callMeFetch('certificate/list/listCert');
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
      this.callMeFetch('certificate/list/listCert');
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
