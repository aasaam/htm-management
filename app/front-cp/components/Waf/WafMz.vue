<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    rules="required"
    :name="$t('matchzone')"
  >
    <v-autocomplete
      v-model="innerMz"
      item-text="value"
      item-value="value"
      :label="$t('matchzone')"
      :items="items"
      color="primary"
      outlined
      clearable
      :error-messages="errors"
      :success="valid"
    >
      <!-- <template slot="item" slot-scope="{ item }">
        {{ item.value }} - ({{ item.abbr }})
      </template> -->
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'WafMz',
  props: {
    mz: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      items: [
        '$HEADERS_VAR',
        '$URL_X',
        '$ARGS_VAR_X',
        '$BODY_VAR_X',
        '$HEADERS_VAR_X',
      ],
      // select: [],
    };
  },
  computed: {
    innerMz: {
      get() {
        return this.mz;
      },
      set(v) {
        this.$emit('update:mz', v);
      },
    },
  },
};
</script>
