<template>
  <v-row>
    <v-col cols="12" class="d-flex mt-3">
      <v-icon large>mdi-server</v-icon>
      <span class="pl-3 pr-3 text-h5">
        {{ $t('addHost') }}
      </span>
    </v-col>
    <v-col cols="12" md="6">
      <ValidationProvider
        v-slot:default="{ errors, valid }"
        :rules="{ required: requiredF }"
        :name="$t('list')"
      >
        <v-textarea
          v-model="innerList"
          outlined
          name="list"
          :error-messages="errors"
          :success="valid"
          filled
          persistent-hint
          :hint="$t('hostListHint')"
          :label="$t('list')"
        ></v-textarea>
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'VhAddHost',
  props: {
    requiredF: {
      type: Boolean,
      required: true,
      default: false,
    },
    host: {
      type: [String, Array],
      required: true,
      default: '',
    },
  },
  computed: {
    innerList: {
      cache: false,
      get() {
        return this.host;
      },
      set(newValue) {
        this.$emit('update:host', newValue);
      },
    },
  },
};
</script>
