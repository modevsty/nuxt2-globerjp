<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Insurance and National Pension'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'insurance',
      type: 'subcategory',
      pageTitle: 'Insurance and National Pension Tips'
    }
  }
}
</script>