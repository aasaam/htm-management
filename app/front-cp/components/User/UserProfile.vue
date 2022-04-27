<template>
  <v-card
    class="mx-auto my-12"
    max-width="500"
    :elevation="$vuetify.theme.dark ? 9 : 8"
  >
    <v-card-title class="teal white--text">
      <v-icon color="white" dark large left> mdi-account </v-icon>
      {{ $t('welcome') }}
    </v-card-title>

    <v-card-text>
      <div class="my-8">
        <v-row no-gutters>
          <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
            <v-card class="pa-2" outlined tile>
              {{ $t('email') }}
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
            <v-card class="pa-2" outlined tile> {{ profile.email }} </v-card>
          </v-col>
          <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
            <v-card class="pa-2" outlined tile>
              {{ $t('status') }}
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
            <v-card class="pa-2" outlined tile>
              <v-chip v-if="profile.active" x-small color="green" dark>
                {{ $t('active') }}
              </v-chip>
              <v-chip v-else x-small color="black" dark>
                {{ $t('inactive') }}
              </v-chip>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title>
      {{ $t('roles') }}
    </v-card-title>

    <v-card-text>
      <v-chip-group active-class="deep-purple accent-4 white--text" column>
        <v-chip v-for="i in profile.roles" :key="i">
          <span v-if="i === 'AD'">
            {{ $t('admin') }}
          </span>
          <span v-if="i === 'VI'">
            {{ $t('viewer') }}
          </span>
          <span v-if="i === 'SA'">
            {{ $t('superAdmin') }}
          </span>
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="deep-purple lighten-2" text @click="edit(profile.id)">
        {{ $t('edit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  methods: {
    edit(uid) {
      this.$router.push(
        this.localeRoute({
          name: 'user-edit-id',
          params: { id: uid },
        }),
      );
    },
  },
};
</script>
