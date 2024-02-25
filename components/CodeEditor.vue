<template>
  <v-container class="d-flex flex-column">
    <v-textarea class="code-editor" v-model="content"/>
    <v-btn @click="validate">Submit</v-btn>
  </v-container>
</template>

<script>
import htmlBeautify from 'html-beautify'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.content = htmlBeautify(val);
    }
  },
  mounted() {
    this.content = htmlBeautify(this.value) || this.content;
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    checkHtml(html) {
      var doc = document.createElement('div');
      doc.innerHTML = html;
      return ( doc.innerHTML === html );
    },
    validate() {
      if (this.checkHtml(this.content)) {
        this.$emit("input", this.content.replace(/>\s+|\s+</g, function(m) {return m.trim();}));
      } else {
        alert("Wrong html");
        this.content = htmlBeautify(this.value);
      }

    }
  }
}
</script>
<style lang="scss" scoped>
.code-editor {
  width: 100%;
}
</style>
