<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Medical Related'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'medical',
      type: 'subcategory',
      pageTitle: 'Medical Related Tips'
    }
  }
}
</script>