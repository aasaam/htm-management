<template>
  <div class="pre-cnt">
    <prism-editor
      v-model="codes"
      dir="ltr"
      class="language-nginx editor-font"
      :highlight="highlighter"
      :tab-size="2"
      :readonly="readonly"
      line-numbers
      @input="sendEditorData"
    ></prism-editor>
  </div>
</template>

<script>
import _ from 'lodash';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-nginx';
import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: 'GlobalEditor',
  components: {
    PrismEditor,
  },
  props: {
    code: {
      type: String,
      require: false,
      default: '',
    },
    readonly: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  computed: {
    codes: {
      get() {
        return this.code;
      },
      set(v) {
        this.$emit('update:code', v);
      },
    },
  },
  methods: {
    highlighter(codes) {
      return highlight(codes, languages.nginx, 'nginx');
    },

    sendEditorData: _.debounce(function () {
      this.$emit('editorData', this.codes);
    }, 600),
  },
};
</script>

<style scoped lang="scss">
.editor-font {
  background: #2d2d2d;
  color: #ccc;
  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
.pre-cnt {
  background-color: #2d2d2d;
  /* color: aqua; */
  padding: 16px;
  pre {
    color: rgb(220, 243, 243);
  }
}

.prism-editor__textarea:focus {
  outline: none;
}
</style>
