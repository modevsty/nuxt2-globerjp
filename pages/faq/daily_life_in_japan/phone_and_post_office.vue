<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Phone and Post Office'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'phone',
      type: 'subcategory',
      pageTitle: 'Phone and Post Office Tips'
    }
  }
}
</script>