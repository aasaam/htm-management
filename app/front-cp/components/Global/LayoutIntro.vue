<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <p
          class="grey--text text--darken-3 display-1 text-center justify-center pb-5"
        >
          {{ $t('projectDescription') }}
        </p>
      </v-col>
      <v-col cols="12" sm="12" md="10" lg="5">
        <!-- slot  -->
        <slot name="frame" />
        <!-- <Login /> -->
      </v-col>
    </v-row>
  </v-container>
</template>
