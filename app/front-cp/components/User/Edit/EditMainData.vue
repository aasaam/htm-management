<template>
  <v-row class="pa-5">
    <v-col cols="12">
      <Snackbar />
      <ValidationObserver ref="obs">
        <v-form
          novalidate="true"
          :disabled="isDisabled"
          @submit.prevent="onSubmit"
        >
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                rules="required|email"
                :name="$t('email')"
              >
                <v-text-field
                  v-model.trim="user.email"
                  :error-messages="errors"
                  :success="valid"
                  dir="ltr"
                  type="text"
                  outlined
                  required
                  :label="$t('email')"
                ></v-text-field>
              </ValidationProvider>
            </v-col>

            <v-col v-if="loginRole.includes('SA')" cols="12" md="6" lg="4">
              <GlobalAutocomplete
                :data-list="roleList"
                :multiple="true"
                :model.sync="user.roles"
                :required="true"
                :label="$t('chooseRole')"
              />
            </v-col>
            <v-col v-if="loginRole.includes('SA')" cols="12" md="4" lg="2">
              <v-checkbox
                v-model="user.active"
                :label="$t('active')"
              ></v-checkbox>
            </v-col>

            <!-- actions -->
            <v-col
              cols="12"
              :class="
                $vuetify.breakpoint.smAndUp
                  ? 'd-flex justify-end align-end'
                  : ''
              "
            >
              <v-btn
                :disabled="isDisabled"
                type="submit"
                x-large
                color="primary white--text"
                class="mb-3 mr-1 ml-1 pl-12 pr-12"
              >
                {{ $t('edit') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'EditMainData',
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loginRole: this.$store.getters['user/auth/GET_ROLE'],
      roleList: [
        {
          name: 'Super Admin',
          value: 'SA',
        },
        {
          name: 'Admin',
          value: 'AD',
        },
        {
          name: 'Viewer',
          value: 'VI',
        },
      ],
      isDisabled: false,
    };
  },
  computed: {
    user: {
      cache: false,
      get() {
        return this.userData;
      },
      set(newValue) {
        this.$emit('update:userData', newValue);
      },
    },
  },
  methods: {
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      const info = {
        id: this.user.id,
        email: this.user.email,
        roles: this.user.roles,
        active: this.user.active,
      };

      const [err, data] = await to(
        this.$store.dispatch('user/edit/editUser', info),
      );
      if (err) {
        this.isDisabled = false;
      }
      if (data) {
        this.isDisabled = true;
        if (this.loginRole.includes('SA')) {
          this.$router.push(
            this.localeRoute({
              name: 'user-list',
            }),
          );
        } else {
          this.$router.push(
            this.localeRoute({
              name: 'user-profile',
            }),
          );
        }
      }
    },
  },
};
</script>
