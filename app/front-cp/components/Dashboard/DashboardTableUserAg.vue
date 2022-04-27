<template>
  <div class="mt-7">
    <h4 class="mb-3">Top User Agents :</h4>
    <v-simple-table class="elevation-3" fixed-header height="410px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ua" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ua: [
        {
          name: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          count: 20,
        },
        {
          name: 'Chrome/74.0.3729.157 Safari/537.36',
          count: 18,
        },
        {
          name: 'Chrome/74.0.3729.157 Safari/537.34',
          count: 16,
        },
        {
          name: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4)',
          count: 14,
        },
        {
          name: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
          count: 10,
        },
        {
          name: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/66.0',
          count: 9,
        },
        {
          name: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
          count: 8,
        },
        {
          name: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36"',
          count: 4,
        },
      ],
    };
  },
};
</script>
