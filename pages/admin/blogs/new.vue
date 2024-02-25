<template>
  <v-container>
    <Spinner color="white" v-if="!user"></Spinner>
    <blog-form v-model="blog" />
  </v-container>
</template>

<script>
import BlogForm from '@/components/BlogForm'
import Spinner from '@/components/LoadingSpinner'
export default {
  name: 'admin',
  middleware: 'auth',
  layout: "default",
  components: { BlogForm, Spinner },
  data () {
    return {
      blog: {}
    }
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
  }
}
</script>

<style scoped>
</style>
