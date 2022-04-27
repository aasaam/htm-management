<template>
  <div class="mb-8">
    <v-row no-gutters class="mb-6">
      <v-col v-for="n in categories" :key="n.name" cols="12" md="5">
        <v-card class="pa-2" outlined tile>
          {{ n.name }}
          <v-chip class="ma-2" color="red" label outlined>
            {{ n.range }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
    <v-simple-table
      dense
      :class="$vuetify.theme.dark ? 'elevation-6' : 'elevation-1'"
      height="300px"
      dir="ltr"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('id') }}
            </th>
            <th class="text-left">
              {{ $t('description') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key, i) in list" :key="i">
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
  </div>
</template>

<script>
import id from '../../utils/rules.json';
export default {
  name: 'WafIdTable',
  data() {
    return {
      list: id,
      categories: [
        {
          name: this.$t('allRules'),
          range: 'IDS:0',
        },
        {
          name: this.$t('internalRules'),
          range: 'IDS:1-999',
        },
        {
          name: this.$t('sqlInjectionRules'),
          range: 'IDs:1000-1099',
        },
        {
          name: this.$t('obviousRfiRules'),
          range: 'IDs:1100-1199',
        },
        {
          name: this.$t('directoryTraversalRules'),
          range: 'IDs:1200-1299',
        },
        {
          name: this.$t('xssRules'),
          range: 'IDs:1300-1399',
        },
        {
          name: this.$t('evadingTrick'),
          range: 'IDs: 1400-1500',
        },
        {
          name: this.$t('fileUploadRules'),
          range: '1500-1600',
        },
      ],
    };
  },
};
</script>
