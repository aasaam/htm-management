<template>
  <div>
    <v-col cols="12" class="white--text d-flex mt-3 primary">
      <v-icon dark>mdi-cog</v-icon>
      <span class="pl-3 pr-3 text-h5">
        {{ $t('aclConfiguration') }}
      </span>
    </v-col>
    <v-alert outlined color="primary" tile dark>
      <div class="text-h6">
        {{ $t('attention') }}
      </div>
      <div>
        {{ $t('protectionAclConfDescription') }}
      </div>
    </v-alert>
  </div>
</template>
