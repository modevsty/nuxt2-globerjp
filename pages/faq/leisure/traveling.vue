<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Traveling'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'traveling',
      type: 'subcategory',
      pageTitle: 'Traveling Tips'
    }
  }
}
</script>