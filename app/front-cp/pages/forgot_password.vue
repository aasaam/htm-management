<template>
  <LayoutIntro>
    <template v-slot:frame>
      <ForgotPassword />
    </template>
  </LayoutIntro>
</template>

<script>
export default {
  layout: 'login',
  permissions: ['SA', 'AD', 'VI'],
  head() {
    return {
      title: this.$t('forgot_password'),
    };
  },
};
</script>
