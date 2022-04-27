<template>
  <div>
    <GlobalEditor :code.sync="fillData" @editorData="recieveEditorData" />
  </div>
</template>

<script>
export default {
  name: 'ManualVh',
  props: {
    fillAdvData: {
      type: String,
      default: '',
    },
  },
  computed: {
    fillData: {
      get() {
        return this.fillAdvData;
      },
      set(newValue) {
        this.$emit('update:fillAdvData', newValue);
      },
    },
  },
  methods: {
    recieveEditorData(val) {
      this.$emit('advanceDatafiller', val);
    },
  },
};
</script>
