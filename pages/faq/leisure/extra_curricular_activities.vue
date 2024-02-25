<template>
  <faq-component :category="category" :type="type" :pageTitle="pageTitle"/>
</template>
<script>
import FaqComponent from '@/components/faqComponent.vue'

export default {
  head: {
    title: 'glober support | Extra Curricular Activities'
  },
  components: {
    FaqComponent
  },
  data() {
    return {
      type: 'subcategory',
      category: 'extra_curricular_activities',
      pageTitle: 'Extra Curricular Activities Tips'
    }
  }
}
</script>