<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Garbage and Recycling'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'garbage',
      type: 'subcategory',
      pageTitle: 'Garbage and Recycling Tips'
    }
  }
}
</script>