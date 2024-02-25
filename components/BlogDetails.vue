<template>
  <div>
    <Spinner color="blue" v-if="!teaser"></Spinner>
    <article v-else class="blog" style="width:calc(100vw-30px);max-width:min(100%,800px);">
      <div class="mb-5">
        <div class="text-xs uppercase font-semibold text-gray-600 mb-1 d-flex flex-wrap">
          <v-chip v-for="tag of tags" :key="tag" class="my-1 ml-0 mr-2 d-flex flex-row">
            {{ tag.toUpperCase() }}
          </v-chip>
        </div>
        <!-- <h1>{{ blog.title }}</h1> -->
        <h2 v-if="blog.lead" class="font-sans text-gray-700 font-light">
          {{ blog.lead }}
        </h2>
        <div class="text-gray-600 text-xs font-light">
          {{ blog.created | toOnlyDate }}
        </div>
      </div>
      <figure v-if="blog.imageUrl" style="min-height: 350px;" class="mb-5">
        <!--suppress HtmlUnknownTarget -->
        <v-img transition="xxx" contain :src="blog.imageUrl" :lazy-src="lazyGif" :alt="blog.imageAlt || blog.title" style="max-height: 350px;height:100%;width:100%" />
        <figcaption v-if="blog.imageCaption" class="text-center text-gray-600 text-sm my-2" v-html="blog.imageCaption" />
      </figure>
      <div class="content" style="word-break: break-word" v-html="blog.body" />
      <div class="clearfix mt-10 text-xs font-semibold uppercase">
        <nuxt-link
          v-if="prev"
          :to="{ name: 'blog-id', params: { id: prev.id } }"
          class="float-left no-underline col-6 break-normal pr-5"
        >
          &lt; {{ prev.title }}
        </nuxt-link>
        <nuxt-link
          v-if="next"
          :to="{ name: 'blog-id', params: { id: next.id } }"
          class="float-right no-underline col-6 break-normal pl-5"
        >
          {{ next.title }} &gt;
        </nuxt-link>
      </div>
    </article>
  </div>
</template>

<script>
import Spinner from '@/components/LoadingSpinner'
import hljs from 'highlight.js/lib/highlight'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import php from 'highlight.js/lib/languages/php'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

export default {
  name: 'BlogDetails',
  components: {
    Spinner
  },
  data() {
    return {
      lazyGif: 'data:image/gif;base64,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',
      blog: {
        title: '',
        body: '',
        tags: []
      }
    }
  },
  props: {
    teaser: {
      type: Object,
      required: true
    },
    prev: {
      type: Object,
      default: null
    },
    next: {
      type: Object,
      default: null
    },
    changed: {
      type: String,
      default: ''
    }
  },
  computed: {
    tags () {
      return this.blog.tags.slice(0).sort()
    }
  },
  watch: {
    // changed(val) {
    //   if (this.teaser.blog && !this.blog.body) {
    //     this.blog = this.teaser;
    //   }
    // },
  },
  methods: {
    replaceUrls(string) {
      const urlRegex = /href="([^\'\"]+)/g
      return string? string.replace(urlRegex, (url) => {
        return (
          ' target="_blank" ' + url
        )
      }) : ''
    },
  },
  mounted () {
    this.blog = this.teaser
    this.blog.body = this.replaceUrls(this.teaser.body)
    hljs.registerLanguage('javascript', javascript)
    hljs.registerLanguage('css', css)
    hljs.registerLanguage('xml', xml)
    hljs.registerLanguage('php', php)
    hljs.registerLanguage('yaml', yaml)
    hljs.registerLanguage('sql', sql)
    hljs.registerLanguage('bash', bash)
    hljs.registerLanguage('shell', shell)

    this.$el.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }
}
</script>
<style lang="scss">
@import '@/assets/variables.scss';
.content {
  img {
    background-image: url('data:image/gif;base64,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')
  }
}


</style>
<style lang="scss">
blockquote {
  border-left: 0.25em solid #dfe2e5;
    color: #6a737d;
    padding-left: 1em;
    margin: 20px 0!important;
}

.content {
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
