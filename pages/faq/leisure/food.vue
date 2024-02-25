<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Food'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'food',
      type: 'subcategory',
      pageTitle: 'Food Tips'
    }
  }
}
</script>