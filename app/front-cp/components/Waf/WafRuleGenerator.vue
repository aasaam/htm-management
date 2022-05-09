<template>
  <v-dialog v-model="syncDialog" scrollable max-width="1260" persistent>
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title dark class="teal darken-1 white--text pa-4">
        {{ $t('ruleGenerator') }}
        <v-spacer></v-spacer>
        <!-- <v-btn large @click="reset">
          {{ $t('reset') }}
        </v-btn> -->
      </v-card-title>

      <v-card-text class="mt-4">
        <p>
          {{ $t('naxiDoc7') }}
        </p>
        <v-divider></v-divider>
        <ValidationObserver ref="wafObs">
          <v-row class="mt-4">
            <v-col cols="12" md="6" lg="4">
              <WafWl :wl-list.sync="waf.wl" />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <WafMz :mz.sync="waf.mz" />
            </v-col>
            <v-col v-if="waf.mz !== '$HEADERS_VAR'" cols="12" md="6" lg="4">
              <WafMzValue
                :hint="waf.mz == '$URL_X' ? '^/foo' : '^[0-9]'"
                :label="$t('regexValue')"
                :mzv.sync="waf.mzValue"
              />
            </v-col>
            <!-- matchzpne value for $HEADERS_VAR -->
            <v-col v-if="waf.mz == '$HEADERS_VAR'" cols="12" md="6" lg="4">
              <WafMzValue
                :label="$t('name')"
                hint="cookie"
                :mzv.sync="waf.mzValue"
              />
            </v-col>

            <!-- URL  -->
            <template v-if="waf.mz == '$URL_X'">
              <v-col cols="12" md="6" lg="4">
                <WafMzTarget
                  :mztarget.sync="waf.mzTarget"
                  @clearmzV="clearmzV"
                />
              </v-col>
              <v-col
                v-if="
                  waf.mzTarget == 'ARGS' ||
                  waf.mzTarget == 'BODY' ||
                  waf.mzTarget == 'HEADERS'
                "
                md="6"
                lg="4"
              >
                <WafLastName :name.sync="waf.lname" />
              </v-col>
              <v-col
                v-if="
                  waf.mzTarget == '$ARGS_VAR_X' ||
                  waf.mzTarget == '$BODY_VAR_X' ||
                  waf.mzTarget == '$HEADERS_VAR_X'
                "
                cols="12"
                md="6"
                lg="4"
              >
                <WafMzValue
                  :label="$t('regexValue')"
                  hint="^[0-9]"
                  :mzv.sync="waf.targetValue"
                />
              </v-col>
            </template>
          </v-row>
        </ValidationObserver>
        <v-divider></v-divider>
        <v-row
          v-if="generateRule !== false"
          class="mt-3"
          justify="center"
          align="center"
        >
          <v-col cols="12" md="6">
            <!-- <v-text-field
              v-model="generateRule"
              readonly
              outlined
              :value="generateRule"
              dir="ltr"
            >
            </v-text-field> -->
            <div class="grey darken-2 white--text pa-3">
              <pre dir="ltr">{{ generateRule }}</pre>
            </div>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              class="d-flex text-center mx-auto"
              @click="copy"
            >
              {{ $t('copyRule') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="closeDialog">
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
    index: {
      type: [String, Number],
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      canCopy: false,
      waf: {
        wl: ['0'],
        mzTarget: '',
        targetValue: '',
      },
    };
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
    generateRule() {
      /* eslint-disable dot-notation */
      let r = 'a';

      r = this.waf['wl'].join();
      if (
        this.waf['wl'] &&
        this.waf.mz &&
        this.waf.mz === '$HEADERS_VAR' &&
        this.waf.mzValue
      ) {
        // ## 1
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}"`;
      } else if (
        this.waf['wl'] &&
        (this.waf.mz === '$ARGS_VAR_X' ||
          this.waf.mz === '$BODY_VAR_X' ||
          this.waf.mz === '$HEADERS_VAR_X') &&
        this.waf.mzValue
      ) {
        // ## 2
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}"`;
      } else if (
        this.waf['wl'] &&
        this.waf.mz === '$URL_X' &&
        this.waf.mzValue &&
        (this.waf.mzTarget === 'URL' || this.waf.mzTarget === 'FILE_EXT')
      ) {
        // ## 3
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}|${this.waf.mzTarget}"`;
      } else if (
        this.waf['wl'] &&
        this.waf.mz === '$URL_X' &&
        this.waf.mzValue &&
        (this.waf.mzTarget === 'ARGS' ||
          this.waf.mzTarget === 'BODY' ||
          this.waf.mzTarget === 'HEADERS') &&
        this.waf.lname === 'Empty'
      ) {
        // ## 4,5
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}|${this.waf.mzTarget}"`;
      } else if (
        this.waf['wl'] &&
        this.waf.mz === '$URL_X' &&
        this.waf.mzValue &&
        (this.waf.mzTarget === 'ARGS' ||
          this.waf.mzTarget === 'BODY' ||
          this.waf.mzTarget === 'HEADERS') &&
        this.waf.lname === 'NAME'
      ) {
        // ## 6
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}|${this.waf.mzTarget}|${this.waf.lname}"`;
      } else if (
        this.waf['wl'] &&
        this.waf.mz === '$URL_X' &&
        this.waf.mzValue &&
        (this.waf.mzTarget === '$ARGS_VAR_X' ||
          this.waf.mzTarget === '$BODY_VAR_X' ||
          this.waf.mzTarget === '$HEADERS_VAR_X') &&
        this.waf.targetValue
      ) {
        // ## 7
        return `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}|${this.waf.mzTarget}:${this.waf.targetValue}"`;
      }
      return false;

      // test all: `BasicRule wl:${r} "mz:${this.waf.mz}:${this.waf.mzValue}|${this.waf.mzTarget}:${this.waf.targetValue}|${this.waf.lname}"`;
    },
  },

  methods: {
    clearmzV(v) {
      this.waf.targetValue = undefined;
      this.$refs.wafObs.reset();
    },
    copy() {
      if (this.generateRule) {
        this.$emit('pasteRule', this.generateRule, this.index);
        this.syncDialog = false;
      }
      this.reset();
    },
    closeDialog(v) {
      this.syncDialog = false;
      this.reset();
    },
    reset() {
      this.waf.targetValue = '';
      this.waf.mzValue = '';
      this.waf.mz = '';
      this.waf.mzTarget = '';
      this.waf.lname = '';
      this.waf.wl = ['0'];
      this.$refs.wafObs.reset();
    },
  },
};
</script>
