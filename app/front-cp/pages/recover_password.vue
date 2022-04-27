<template>
  <LayoutIntro>
    <template v-slot:frame>
      <RecoverPassword />
    </template>
  </LayoutIntro>
</template>

<script>
export default {
  layout: 'login',
  permissions: ['SA', 'AD', 'VI'],
  head() {
    return {
      title: this.$t('recoverPassword'),
    };
  },
};
</script>
