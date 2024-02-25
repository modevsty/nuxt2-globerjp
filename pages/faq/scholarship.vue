<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Scholarship'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'scholarship',
      type: 'subcategory',
      pageTitle: 'Scholarship Tips'
    }
  }
}
</script>