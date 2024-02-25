<template>
  <div>
    <tiptap-vuetify class="tiptap_vuetify" v-model="content" :extensions="extensions"/>
  </div>
</template>

<script>
import FileSelector from '@/Components/FileSelector'
import {
  // component
  TiptapVuetify,
  // extensions
  Bold,
  Italic,
  Strike,
  Underline,

  Link,

  History,
  Image,
} from 'tiptap-vuetify';

export default {
  components: { TiptapVuetify },
  props: {
    value: {
      type: String,
      default: ''
    },
    changed: {
      type: String,
      default: ''
    }
  },
  watch: {
    content (val) {
      this.$emit("input", val);
    },
    value (val) {
      this.content = val || this.content;
    }
  },
  mounted() {
    this.content = this.value || this.content;
  },
  data() {
    return {
      html: '',
      extensions: [
      History,
      Link,
      Underline,
      Strike,
      Italic,
      Bold,
    ],
    content: '',
    content2: `
      <h1>Most basic use</h1>
      <p>
        You can use the buttons above to add different text decorations. For example:
        <strong>
          Bold.
        </strong>
        <i>
          Italics.
        </i>
      </p>
      <pre><code>You can even type some code.</code></pre>

      <blockquote>
        <p>Blockquote is awesome!</p>
      </blockquote>
      <p>Try adding a table like the one below:</p>
      <table>
        <tr>
          <th colspan="2" data-colwidth="100,0">Wide header</th>
        </tr>
        <tr>
          <td>One</td>
          <td>Two</td>
        </tr>
        <tr>
          <td>Three</td>
          <td>Four</td>
        </tr>
      </table>
      <p>List items:</p>
      <ol>
        <li>
          <p>Item 1</p>
        </li>
        <li>
          <p>Item 2</p>
        </li>
      </ol>
    `
    }
  }
}
</script>
<style lang="scss">
  .is-active {
    background-color: gray
  }
  .v-tab:nth-child(3) {
    display: none;
  };
  .tiptap_vuetify {
      table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
    th {
      font-weight: 700;
      text-align: left;
      min-width: 1em;
      border: 2px solid grey;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
    }
    td {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 1em;
      border: 2px solid grey;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      h1{
        width: fit-content;
      }
      h2{
        width: fit-content;
      }
      h3{
        width: fit-content;
      }
      h4{
        width: fit-content;
      }
      h5{
        width: fit-content;
      }
    }
  } 
    img {
      object-fit: contain;
      max-width: 100%;
      max-height: 350px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

</style>
