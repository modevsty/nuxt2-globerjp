<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Transportation'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'transportation',
      type: 'subcategory',
      pageTitle: 'Transportation Tips'
    }
  }
}
</script>