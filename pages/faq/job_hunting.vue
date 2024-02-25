<template>
    <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Job Hunting'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'job_hunting',
      type: 'subcategory',
      pageTitle: 'Job Hunting Tips'
    }
  }
}
</script>
