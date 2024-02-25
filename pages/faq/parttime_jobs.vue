<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Parttime Jobs'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      category: 'parttime_jobs',
      type: 'subcategory',
      pageTitle: 'Part-time Jobs Tips'
    }
  }
}
</script>