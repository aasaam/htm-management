const globalApply = {
  data() {
    return {
      applyTimer: null,
      currentRole: this.$store.state.user.auth.userData.roles,
    };
  },
  created() {
    this.checkApplyTimer();
  },

  beforeDestroy() {
    clearInterval(this.applyTimer);
  },
  methods: {
    checkApplyTimer() {
      const isActive = () => {
        return document.hasFocus();
      };
      // check if role is only 'VI'
      if (this.currentRole.length === 1 && this.currentRole[0] === 'VI') {
        return;
      }
      this.applyTimer = setInterval(() => {
        if (isActive()) {
          this.$store.dispatch('setting/all/readSetting');
        }
      }, 9000);
    },
  },
};
export default globalApply;
