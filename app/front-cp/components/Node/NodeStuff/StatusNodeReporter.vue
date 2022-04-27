<template>
  <div>
    <v-row
      v-for="(it, index) in nodeResult"
      :key="index"
      no-gutters
      justify="center"
      align="center"
      class="mb-5 mt-5"
    >
      <v-col cols="12">
        <div class="mb-3">
          <div class="mb-1" dir="ltr">
            <code class="font-weight-bold title grey darken-2 white--text">
              <v-icon v-if="it.err" color="error"> mdi-close-thick </v-icon>
              <v-icon v-else color="success"> mdi-check-bold </v-icon>
              {{ it.item.nodeId }}[{{ it.item.ip }}]
            </code>
            <v-btn
              text
              dark
              small
              color="primary"
              class="mr-2 ml-2 pb-2"
              @click="it.err ? copyText(it.err) : copyText(it.body)"
            >
              <v-icon small dark> mdi-content-copy </v-icon>
            </v-btn>
          </div>

          <pre
            dir="ltr"
            :class="
              it.err === undefined
                ? 'success scroll-horizon pa-4'
                : 'error lighten-4 scroll-horizon pa-4'
            "
          ><template v-if="it.err">{{ it.err }}</template><template v-if="it.body">{{ it.body }}</template></pre>
        </div>
      </v-col>
      <v-divider></v-divider>
    </v-row>
    <!-- errorLocate -->
    <v-row v-if="Object.keys(errorLocate).length > 0">
      <v-col cols="12">
        <v-divider></v-divider>
        <v-alert border="top" elevation="2" type="info">
          {{ $t('solveErrors') }}
        </v-alert>

        <div v-for="(value, propertyName) in errorLocate" :key="propertyName">
          <div v-for="(i, n) in value" :key="n">
            <span class="font-weight-bold">
              {{ n + 1 }} - {{ $t(`${propertyName}`) }} ({{ i.name }})
            </span>
            <v-btn
              dark
              small
              color="primary"
              :to="localePath(`/${propertyName}/edit/${i.id}`)"
              nuxt
              target="_blank"
              icon
            >
              <v-icon small dark> mdi-link </v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import copy from '@/mixin/copyToclipboard';
export default {
  name: 'StatusNodeReporter',
  mixins: [copy],
  props: {
    nodeResult: {
      type: Array,
      required: true,
    },
    errorLocate: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-horizon {
  overflow-x: auto;
  overflow-y: auto;
}
</style>
