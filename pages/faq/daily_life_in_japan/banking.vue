<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Banking'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'banking',
      type: 'subcategory',
      pageTitle: 'Banking Tips'
    }
  }
}
</script>