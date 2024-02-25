<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Immigration Related'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'immigration',
      type: 'subcategory',
      pageTitle: 'Immigration Related Tips'
    }
  }
}
</script>