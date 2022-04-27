<template>
  <v-card min-height="288">
    <v-card-text>
      <client-only>
        <Chart type="donut" :series="series" :label="label" />
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      series: [100],
      label: ['HTTP/1.1'],
    };
  },
};
</script>
