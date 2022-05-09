<template>
  <v-dialog
    v-model="syncDialog"
    scrollable
    max-width="1200"
    persistent
  >
    <v-card>
      <v-card-title class="teal accent-4 darken-1 headline pb-4 white--text">
        {{ $t('nodeInfo') }}
      </v-card-title>

      <v-card-text class="mt-4">
        <p v-if="errBody" class="red--text">
          <pre class="red--text pink lighten-5 pa-4" dir="ltr">{{ errBody }}</pre>
        </p>

        <v-simple-table
          v-if="!errBody"
          dense
          :class="$vuetify.theme.dark ? 'elevation-6' : 'elevation-1'"
          height="420px"
          dir="ltr"
        >
         <v-divider></v-divider>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Title
                </th>
                <th class="text-left">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key, i) in body" :key="i">
                <td>
                  {{ key }}
                </td>
                <td>
                  <code>
                    {{ value }}
                  </code>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="close">
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
    body: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    errBody: {
      type: [String, Object],
      required: false,
      default: () => null,
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
  methods: {
    close() {
      this.syncDialog = false;
    },
  },
};
</script>
