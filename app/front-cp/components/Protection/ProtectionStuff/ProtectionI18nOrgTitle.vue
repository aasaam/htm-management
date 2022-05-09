<template>
  <v-dialog v-model="dialog" width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn large color="primary" dark v-bind="attrs" v-on="on">
        {{ $t('addOrgTitle') }}
      </v-btn>
    </template>

    <v-card class="mt-0 pt-0">
      <v-card-title class="text-h6 grey darken-2 pb-4 white--text">
        {{ $t('addOrgTitle') }}
      </v-card-title>

      <v-card-text>
        <p class="text--primary pb-2 mt-3 caption">
          <v-icon small class="pb-1"> mdi-alert-circle-outline </v-icon>
          {{ $t('addOrgDesc') }}
        </p>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row
            v-for="(i, n) in list"
            :key="n"
            justify="center"
            align="center"
          >
            <v-col cols="2" class="pt-0">
              <span>
                {{ i.nativeName }}
              </span>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model.trim="i.title"
                color="primary"
                outlined
                :dir="i.iso === 'en' ? 'ltr' : 'rtl'"
                :rules="[(v) => !!v || 'Item is required']"
                dense
                :label="$t('addOrgTitle')"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" @click.prevent="submit">
          {{ $t('add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { by639_1 as By639 } from 'iso-language-codes';

export default {
  props: {
    suggestedLang: {
      type: Array,
      default: () => [{ nativeName: 'English', title: '', iso: 'en' }],
      required: true,
    },
    dataFiller: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
  data() {
    return {
      dialog: false,
      isDisabled: true,
      valid: false,
    };
  },
  computed: {
    list() {
      // eslint-disable-next-line prefer-const
      let list = this.suggestedLang.map((lang) => {
        const nativeName = By639[lang].nativeName;
        return {
          nativeName,
          title: '',
          iso: lang,
        };
      });

      if (this.dataFiller) {
        Object.keys(this.dataFiller).forEach((key) => {
          list.forEach((lang) => {
            if (lang.iso === key) {
              lang.title = this.dataFiller[key];
            }
          });
        });
      }
      return list;
    },
  },
  watch: {
    // if dataFiller is not empty, then we are in edit mode
    dataFiller() {
      const a = this.dataFiller;
      if (Object.keys(a).length) {
        this.list.forEach((lang) => {
          // eslint-disable-next-line no-unused-vars
          const { nativeName, title, iso } = lang;
          const { [iso]: value } = a;
          lang.title = value;
        });
      }
    },
  },

  methods: {
    async submit() {
      /**
       *{
       * "fa": "title1",
       * "en": "title2"
       * }
       */

      const v = await this.$refs.form.validate();

      if (v) {
        const list = this.list.reduce((acc, cur) => {
          acc[cur.iso] = cur.title;
          return acc;
        }, {});

        this.$emit('orgI18n', list);
        this.dialog = false;
      } else {
        this.isDisabled = false;
      }
    },
  },
};
</script>
