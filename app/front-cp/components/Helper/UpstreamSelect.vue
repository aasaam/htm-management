<template>
  <div>
    <ShowConfDialog
      :dialog.sync="dialog"
      :title="$t('showConfig')"
      :data="dataCode"
    />
    <ValidationProvider
      v-slot:default="{ errors, valid }"
      :rules="{ required: required }"
      :name="$t('upstream')"
    >
      <v-autocomplete
        :value="upstream"
        :items="upstreamList"
        color="primary"
        :label="$t('chooseUpstream')"
        outlined
        cache-items
        item-text="name"
        item-value="id"
        return-object
        :error-messages="errors"
        :success="valid"
        @input="handleInput"
      >
        <template slot="append-outer">
          <v-btn
            :disabled="iconVisibility"
            icon
            color="blue"
            @click="showUpstream"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-autocomplete>
    </ValidationProvider>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const { to } = require('await-to-js');

export default {
  name: 'UpstreamSelect',
  props: {
    upstream: {
      type: String,
      default: '',
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      iconVisibility: true,
      dataCode: '',
      currentId: '',
    };
  },

  computed: {
    ...mapGetters({
      upstreamList: 'upstream/list/GET_UPSTR_LIST',
    }),
  },
  async mounted() {
    await to(
      this.$store.dispatch('upstream/list/listUpstream', {
        args: {
          limit: 40,
        },
      }),
    );
  },
  methods: {
    async showUpstream() {
      const result = await this.$store.dispatch(
        'upstream/list/singleUpstream',
        this.currentId,
      );

      const [err, data] = await to(
        this.$store.dispatch('helper/generate', {
          type: 'upstream',
          dataModel: result,
        }),
      );
      if (data) {
        this.dataCode = data;
        this.dialog = true;
      }
      if (err) {
        this.isDisabled = false;
      }
    },
    handleInput(e) {
      this.$emit('update:upstream', e.id);
      this.iconVisibility = false;
      this.currentId = e.id;
    },
  },
};
</script>
