<template>
  <div>
    <CodeEditor
      dir="ltr"
      :name.sync="namei"
      :code.sync="fillData"
      @editorData="recieveEditorData"
    />
  </div>
</template>

<script>
export default {
  name: 'ManualUpstream',
  props: {
    fillAdvData: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      require: true,
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
    namei: {
      get() {
        return this.name;
      },
      set(newValue) {
        this.$emit('update:name', newValue);
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
