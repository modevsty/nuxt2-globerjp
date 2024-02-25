<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Housing'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'housing',
      type: 'subcategory',
      pageTitle: 'Housing Tips'
    }
  }
}
</script>