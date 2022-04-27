<template>
  <LayoutIntro>
    <template v-slot:frame>
      <Login />
    </template>
  </LayoutIntro>
</template>

<script>
export default {
  layout: 'login',
  permissions: ['SA', 'AD', 'VI'],
  head() {
    return {
      title: this.$t('login'),
    };
  },
};
</script>
