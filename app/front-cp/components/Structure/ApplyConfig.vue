<template>
  <div class="mr-3 ml-3">
    <template v-if="calc && allowedToSee">
      <v-btn
        color="warning"
        :disabled="calc.changeTimeModule === calc.applyTimeModule"
        @click="dialog = true"
      >
        {{ $t('updateAvailable') }}
      </v-btn>
      <v-btn
        v-if="calc.changeTimeModule === calc.applyTimeModule"
        color="success"
        depressed
        class="mr-2 ml-2"
      >
        {{ $t('synced') }}
        <v-icon> mdi-check </v-icon>
      </v-btn>
    </template>

    <v-dialog v-model="dialog" max-width="80%" persistent>
      <v-card>
        <v-card-text class="pt-12 pb-12">
          <v-container>
            <v-row align="center" justify="center">
              <v-col v-if="whileUpdateMode" cols="12">
                <div v-if="!loading1" class="text-center">
                  <v-btn
                    x-large
                    :loading="loading1"
                    :disabled="loading1"
                    color="primary"
                    @click="update"
                  >
                    <template v-if="retry">
                      {{ $t('tryAgain') }}
                    </template>
                    <template v-else>
                      {{ $t('startUploadConfiguration') }}
                    </template>
                  </v-btn>
                </div>
                <div v-show="loading1" class="text-center">
                  <v-progress-circular
                    indeterminate
                    :size="60"
                    :width="10"
                    color="purple"
                  >
                  </v-progress-circular>
                  <v-card-title class="text-h5 d-inline">
                    {{ $t('checkingUploadResult') }}
                  </v-card-title>
                </div>
              </v-col>
            </v-row>
            <!-- result -->
            <v-row v-if="nodeResult">
              <v-col cols="12">
                <v-divider></v-divider>
                <v-card-title class="text-h6 mr-0 ml-0 pr-0 pl-0">
                  <v-icon :right="$vuetify.rtl" :left="!$vuetify.rtl">
                    mdi-bell
                  </v-icon>
                  {{ $t('uploadedResult') }} :
                </v-card-title>
              </v-col>
              <v-col cols="12">
                <StatusNodeReporter
                  :node-result="nodeResult"
                  :error-locate="errorLocate"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-text v-if="nodeResult" dir="ltr"> </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pt-6 pb-6">
          <v-spacer></v-spacer>

          <v-btn
            v-if="applyBtn"
            :loading="loading2"
            :disabled="loading2"
            color="primary darken-1"
            @click="restart"
          >
            {{ $t('applyConfiguration') }}
          </v-btn>
          <v-btn text color="warning darken-1" @click="closeDialog">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ApplyConfig',
  data() {
    return {
      loading1: false,
      loading2: false,
      dialog: false,
      nodeResult: null,
      errorLocate: {},
      applyBtn: false,
      retry: false,
      whileUpdateMode: true,
      currentRole: this.$store.state.user.auth.userData.roles,
    };
  },
  computed: {
    ...mapState({
      calc: (state) => state.setting.all.apply,
    }),
    allowedToSee() {
      // check if role is only 'VI'
      let canSee = true;
      if (this.currentRole.length === 1 && this.currentRole[0] === 'VI') {
        canSee = false;
      }
      return canSee;
    },
  },
  methods: {
    async update() {
      this.errorLocate = {};
      this.loading1 = true;
      const result = await this.$store.dispatch('node/status/apply');
      this.resultProcess(result);
    },

    async restart() {
      this.loading2 = true;
      this.nodeResult = null;
      this.errorLocate = {};

      const result = await this.$store.dispatch('node/status/restart');
      const re = this.resultProcess(result);
      if (re === 'yes') {
        this.applyBtn = false;
      }
    },

    resultProcess(result) {
      if (
        result &&
        result[0].extensions &&
        result[0].extensions.validation.length > 0
      ) {
        const data = result[0].extensions.validation;
        this.loading1 = false;
        this.nodeResult = data;
        this.applyBtn = false;
        this.retry = true;
        this.errorLocate = result[0].extensions.errorInfo;
        this.$store.dispatch('setting/all/readSetting');
        return 'no';
      } else {
        this.loading1 = false;
        this.loading2 = false;
        this.nodeResult = result;
        this.applyBtn = true;
        this.whileUpdateMode = false;
        this.$store.dispatch('setting/all/readSetting');
        return 'yes';
      }
    },

    closeDialog() {
      this.dialog = false;
      this.retry = false;
      this.applyBtn = false;
      this.nodeResult = null;

      this.errorLocate = {};
      this.whileUpdateMode = true;
    },
  },
};
</script>
