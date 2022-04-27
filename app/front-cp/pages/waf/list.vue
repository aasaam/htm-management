<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <WafList
      :headers="headers"
      :general-action="generalAction"
      :option="options"
    />
  </v-container>
</template>

<script>
import listInfo from '@/mixin/wafListInfo';

export default {
  permissions: ['SA', 'AD', 'VI'],
  mixins: [listInfo],
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 8,
        pageStart: 1,
        pageStop: 1,
        sortBy: ['_id'],
        sortDesc: [false],
      },
    };
  },
  head() {
    return {
      title: this.$t('wafList'),
    };
  },
};
</script>
