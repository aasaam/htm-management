<template>
  <div>
    <h4 class="mb-3">Request by ip address :</h4>
    <v-simple-table class="elevation-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">IPs ssy</th>
            <th class="text-left">Cohhuntry</th>
            <th class="text-left">Alerts</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in waflist" :key="item.name">
            <td>{{ item.ip }}</td>
            <td>{{ item.country }}</td>
            <td>{{ item.alert }}</td>
            <td>
              <v-chip small color="primary"> view logs</v-chip>
            </td>
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
      waflist: [
        {
          ip: '123.157.233.250',
          country: 'China',
          alert: 159,
        },
        {
          ip: '61.157.233.250',
          country: 'France',
          alert: 85,
        },
        {
          ip: '91.157.233.92',
          country: 'Iran',
          alert: 62,
        },
        {
          ip: '188.157.247.153',
          country: 'China',
          alert: 42,
        },
        {
          ip: '23.157.247.153',
          country: 'United States',
          alert: 37,
        },
      ],
    };
  },
  mounted() {},
};
</script>
