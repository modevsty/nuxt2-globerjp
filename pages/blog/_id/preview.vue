<template>
  <blog-details v-if="blog" :blog="blog" />
</template>
<script>
import BlogDetails from '~/components/BlogDetails'

export default {
  name: 'BlogPreviewPage',
  // middleware: 'auth',
  components: { BlogDetails },
  data () {
    return {
      blog: null
    }
  },
  validate ({ params }) {
    // Must be a number
    return params.id !== undefined
  },
  async mounted () {

    try {
      const documentSnapshot = await this.$fire.firestore.collection('blogs')
        .doc(this.$route.params.id)
        .get()

      if (!documentSnapshot.exists) {
        this.$nuxt.error({ statusCode: 404, message: 'Blog not found' })
        return
      }

      this.blog = {
        id: documentSnapshot.id,
        ...documentSnapshot.data()
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      this.$nuxt.error({ statusCode: 404, message: 'Blog not found' })
    }
  }
}
</script>
<style scoped>
</style>
