<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    rules="required|wafzero"
  >
    <v-autocomplete
      v-model="innerWl"
      item-text="value"
      item-value="value"
      label="Wl"
      :items="items"
      multiple
      color="blue-grey lighten-2"
      outlined
      :error-messages="errors"
      :success="valid"
    >
      <template slot="item" slot-scope="{ item }">
        <span> {{ item.value }} - ({{ item.abbr }}) </span>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import id from '../../utils/rules.json';
export default {
  name: 'WafWl',
  props: {
    wlList: {
      type: Array,
      default: () => ['0'],
      required: false,
    },
  },
  data() {
    return {
      items: [],
      // select: [],
    };
  },
  computed: {
    innerWl: {
      get() {
        return this.wlList;
      },
      set(v) {
        this.$emit('update:wlList', v);
      },
    },
  },
  mounted() {
    const b = id;
    const manipulatedArr = [];
    Object.entries(b).map((s) => {
      manipulatedArr.push({
        value: s['0'],
        abbr: s['1'],
      });
      return s;
    });

    this.items = manipulatedArr;
  },
};
</script>
