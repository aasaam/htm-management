<template>
  <div class="pre-cnt">
    <pre>upstream {{ innerName }} {</pre>
    <prism-editor
      v-model="codes"
      dir="ltr"
      class="language-nginx my-editor"
      :highlight="highlighter"
      :tab-size="2"
      line-numbers
      @input="sendEditorData"
    ></prism-editor>
    <pre>}</pre>
  </div>
</template>

<script>
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-nginx';
import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: 'CodeEditor',
  components: {
    PrismEditor,
  },
  props: {
    code: {
      type: String,
      require: false,
      default: '',
    },
    name: {
      type: String,
      require: true,
      default: '',
    },
  },
  data() {
    return {
      codes: this.code,
    };
  },

  computed: {
    innerName: {
      get() {
        return this.name;
      },
      set(v) {
        this.$emit('update:name', v);
      },
    },
  },
  methods: {
    highlighter(codes) {
      return highlight(codes, languages.nginx, 'nginx');
    },
    sendEditorData() {
      this.$emit('editorData', this.codes);
    },
  },
};
</script>

<style scoped lang="scss">
.pre-cnt {
  background-color: #2d2d2d;
  padding: 16px;
  pre {
    color: aqua;
  }
}
.my-editor {
  background: #2d2d2d;
  color: #ccc;
  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
.prism-editor__textarea:focus {
  outline: none;
}
</style>
