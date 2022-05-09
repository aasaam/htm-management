<template>
  <tr
    :class="
      $vuetify.theme.dark
        ? 'grey darken-4 font-weight-light rounded pa-4 white--text'
        : 'white font-weight-light rounded pa-4 white--text'
    "
  >
    <td
      v-for="f in filterType"
      :key="f.name"
      :class="
        $vuetify.breakpoint.smAndDown
          ? 'd-inline pt-1 no-border-bottom'
          : $vuetify.breakpoint.mdAndUp
          ? 'd-block d-md-table-cell pt-2 pb-2'
          : 'd-block d-md-table-cell pt-3 pb-3'
      "
    >
      <template v-if="f.type == 'text'">
        <v-text-field
          v-model="filter[`re_${f.value}`]"
          hide-details
          dense
          type="text"
          clearable
          outlined
          :label="$t(f.value)"
          @input="sendFilter"
        ></v-text-field>
      </template>
      <template v-if="f.type == 'Arrtext'">
        <v-text-field
          v-model="filter[`arrIn_${f.value}`]"
          hide-details
          dense
          type="text"
          clearable
          outlined
          :label="$t(f.value)"
          @input="sendFilter"
        ></v-text-field>
      </template>
      <template v-if="f.type == 'box'">
        <v-select
          v-model="filter[`arrAll_${f.value}`]"
          hide-details
          outlined
          clearable
          :items="f.items"
          :label="$t(f.value)"
          dense
          item-text="name"
          item-value="value"
          @input="sendFilter"
        ></v-select>
      </template>
      <template v-if="f.type == 'number'">
        <v-text-field
          v-model.number="filter[`re_${f.value}`]"
          hide-details
          dense
          clearable
          type="number"
          min="0"
          outlined
          :label="$t(`${f.value}`)"
          @input="sendFilter"
        ></v-text-field>
      </template>
      <template v-if="f.type == 'daterange'">
        <RangeDateTimePicker
          :dense="true"
          :hidedetail="true"
          :lang="currentLang"
          :from-date.sync="fromDate"
          :to-date.sync="toDate"
          placeholder="Select datetime"
        />
      </template>
      <!-- <template v-if="f.type == 'daterangeEnd'">
        <RangeDateTimePicker
          :dense="true"
          :hidedetail="true"
          lang="en"
          :from-date.sync="fromDateE"
          :to-date.sync="toDateE"
          :column="true"
          placeholder="Select datetime"
        />
      </template> -->
    </td>
  </tr>
</template>

<script>
import debounce from 'lodash/debounce';
import 'aasaam-vuetify-datetime';

export default {
  name: 'TableFilter',
  props: {
    filterType: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      fromDate: undefined,
      toDate: undefined,
      filter: {},
    };
  },
  computed: {
    currentLang() {
      return this.$i18n.locale;
    },
  },
  watch: {
    filter: {
      handler(val) {
        let whoRemove = '';
        for (const [key, value] of Object.entries(val)) {
          whoRemove = key;
          if (value == null) {
            this.$delete(this.filter, whoRemove);
          }
        }
      },
      deep: true,
    },
    fromDate(val) {
      const d = new Date();
      if (val === undefined) {
        this.$set(this.filter, 'dts_notAfter', d);
        this.$emit('sendReadyFilter', this.filter);
      }
      this.$set(this.filter, 'dts_notAfter', val);
      this.$emit('sendReadyFilter', this.filter);
    },

    toDate(val) {
      this.$set(this.filter, 'dte_notAfter', val);
      this.$emit('sendReadyFilter', this.filter);
    },
  },
  methods: {
    sendFilter: debounce(function () {
      this.$emit('sendReadyFilter', this.filter);
    }, 900),
  },
};
</script>
<style lang="scss" scoped>
.no-border-bottom {
  border-bottom: none !important;
}
</style>
