<template>
  <v-simple-table
    dense
    :class="$vuetify.theme.dark ? 'elevation-6' : 'elevation-1'"
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th>
            {{ $t('number') }}
          </th>
          <th>
            {{ $t('apiKeyTitle') }}
          </th>
          <th>
            {{ $t('apiKeyToken') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key, i) in tokens" :key="i">
          <td>{{ key + 1 }}</td>
          <td>
            {{ value.name }}
          </td>
          <td>
            <code>
              {{ value.token }}
            </code>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'ApikeyTable',
  // eslint-disable-next-line vue/require-prop-types
  props: ['tokens'],
};
</script>
