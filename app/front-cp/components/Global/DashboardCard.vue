<template>
  <v-row justify="center" align="center">
    <!-- uploadFile -->
    <v-col v-show="uploadFile['0'].upPermission" cols="12" md="4" lg="3">
      <v-card
        v-for="i in uploadFile"
        :key="i.title"
        :color="i.color"
        class="mx-auto text-center pt-6 pb-6"
        :to="i.link"
        nuxt
      >
        <v-icon x-large class="white--text text-center mx-auto pt-3">
          {{ i.icon }}
        </v-icon>
        <v-card-title>
          <div class="text-h5 white--text text-center mx-auto">
            {{ $t(`${i.title}`) }}
          </div>
        </v-card-title>
      </v-card>
    </v-col>
    <!-- fileList -->
    <v-col v-show="fileList['0'].dlPermission" cols="12" md="4" lg="3">
      <v-card
        v-for="i in fileList"
        :key="i.title"
        :color="i.color"
        class="mx-auto text-center pt-6 pb-6"
        :to="i.link"
        nuxt
      >
        <v-icon x-large class="white--text text-center mx-auto pt-3">
          {{ i.icon }}
        </v-icon>
        <v-card-title>
          <div class="text-h5 white--text text-center mx-auto">
            {{ $t(`${i.title}`) }}
          </div>
        </v-card-title>
      </v-card>
    </v-col>
    <!-- userAdd -->
    <v-col v-show="userAdd['0'].admin" cols="12" md="4" lg="3">
      <v-card
        v-for="i in userAdd"
        :key="i.title"
        :color="i.color"
        class="mx-auto text-center pt-6 pb-6"
        :to="i.link"
        nuxt
      >
        <v-icon x-large class="white--text text-center mx-auto pt-3">
          {{ i.icon }}
        </v-icon>
        <v-card-title>
          <div class="text-h5 white--text text-center mx-auto">
            {{ $t(`${i.title}`) }}
          </div>
        </v-card-title>
      </v-card>
    </v-col>
    <!-- tagAdd -->
    <v-col v-show="tagAdd['0'].admin" cols="12" md="4" lg="3">
      <v-card
        v-for="i in tagAdd"
        :key="i.title"
        :color="i.color"
        class="mx-auto text-center pt-6 pb-6"
        :to="i.link"
        nuxt
      >
        <v-icon x-large class="white--text text-center mx-auto pt-3">
          {{ i.icon }}
        </v-icon>
        <v-card-title>
          <div class="text-h5 white--text text-center mx-auto">
            {{ $t(`${i.title}`) }}
          </div>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'DashboardCard',
  data() {
    return {
      uploadFile: [
        {
          color: 'red darken-2',
          icon: 'mdi-cloud-upload-outline',
          title: 'uploadFile',
          link: '/file/add',
          upPermission: this.$store.state.user.userdata['0'].uploadPermission,
        },
      ],
      fileList: [
        {
          color: 'primary',
          icon: 'mdi-clipboard-list-outline',
          title: 'fileList',
          link: '/file/list',
          dlPermission: this.$store.state.user.userdata['0'].downloadPermission,
        },
      ],
      userAdd: [
        {
          color: 'green',
          icon: 'mdi-account',
          title: 'addUser',
          link: '/user/add',
          admin: this.$store.state.user.userdata['0'].admin,
        },
      ],
      tagAdd: [
        {
          color: 'warning',
          icon: 'mdi-tag-multiple',
          title: 'addTag',
          link: '/tag/add',
          admin: this.$store.state.user.userdata['0'].admin,
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
i {
  font-size: 56px !important;
  text-align: center !important;
  margin: 0 auto !important;
}
</style>
