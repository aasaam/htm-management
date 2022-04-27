<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UserList
      :headers="headers"
      :general-action="generalAction"
      :option="options"
    />
  </v-container>
</template>

<script>
import listInfo from '@/mixin/userListInfo';

export default {
  permissions: ['SA', 'AD'],
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
      title: this.$t('userList'),
    };
  },
};
</script>
