<template>
  <v-row>
    <v-col v-for="i in sparkle" :key="i.name" cols="12" md="3">
      <v-card class="mx-auto text-center" color="green" dark max-width="600">
        <v-card-text>
          <v-sheet :color="i.color">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item"> ${{ item.value }} </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>

        <v-card-text>
          <div class="display-1 font-weight-thin">Sales Last 24h</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-btn block text> Go to Report </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'Sparkle',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    sparkle: {
      type: Array,
    },
  },
  data: () => ({
    value: [423, 446, 675, 510, 590, 610, 760],
  }),
};
</script>
