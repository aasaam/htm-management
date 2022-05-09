<template>
  <v-dialog v-model="syncDialog" scrollable max-width="1200">
    <v-card>
      <v-card-title class="teal accent-4 darken-1 headline pb-4 white--text">
        {{ $t('whiteList') }}
      </v-card-title>

      <v-card-text class="mt-4">
        <p>
          {{ $t('naxiDoc1') }}
        </p>
        <v-divider></v-divider>
        <v-card-title class="pl-0 pr-0 headline">
          {{ $t('syntax') }}
        </v-card-title>
        <div class="mb-6">
          <v-img :src="require('../../assets/images/wafp.svg')"></v-img>
        </div>
        <v-divider></v-divider>
        <v-card-title class="pl-0 pr-0 headline">
          {{ $t('whiteListId') }}
        </v-card-title>
        <WafIdTable />
        <v-divider></v-divider>
        <v-card-title class="pl-0 pr-0 headline">
          {{ $t('matchzone') }}
        </v-card-title>
        <p>
          {{ $t('naxiDoc2') }}
        </p>

        <ul class="mb-3" dir="ltr">
          <li>ARGS: GET args</li>
          <li>HEADERS : HTTP Headers</li>
          <li>BODY : POST args (and RAW_BODY)</li>
          <li>URL: The URL itself (before '?')</li>
        </ul>
        <p>
          {{ $t('naxiDoc3') }}
        </p>
        <ul class="mb-3" dir="ltr">
          <li>$ARGS_VAR:string: named GET argument</li>
          <li>$HEADERS_VAR:string : named HTTP header</li>
          <li>$BODY_VAR:string: named POST argument</li>
        </ul>
        <p>
          {{ $t('naxiDoc4') }}
        </p>
        <ul class="mb-3" dir="ltr">
          <li>
            $HEADERS_VAR_X:regex: regex matching a named HTTP header (>= 0.52)
          </li>
          <li>
            $ARGS_VAR_X:regex: regex matching the name of a GET argument (>=
            0.52)
          </li>
          <li>
            $BODY_VAR_X:regex: regex matching the name of a POST argument (>=
            0.52)
          </li>
        </ul>
        <p>
          {{ $t('naxiDoc5') }}
        </p>
        <ul class="mb-3" dir="ltr">
          <li>$URL:string: restricted to this url</li>
          <li>$URL_X:regex: restricted to url matching regex (>= 0.52)</li>
        </ul>
        <p>
          {{ $t('naxiDoc6') }}
        </p>

        <code dir="ltr">
          BasicRule id:1310,1311 "mz:$URL:/foo|BODY|NAME";
        </code>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="syncDialog = false">
          {{ $t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    syncDialog: {
      get() {
        return this.dialog;
      },
      set(v) {
        this.$emit('update:dialog', v);
      },
    },
  },
};
</script>
