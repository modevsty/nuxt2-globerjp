<template>
  <v-container pt-12>
    <Spinner color="white" v-if="!user"></Spinner>
    <nuxt-link to="/admin/blogs/new" class="new">
      Create new article
    </nuxt-link>
    <v-simple-table class="w-full">
      <thead>
        <tr>
          <th>
            ID
          </th>
          <th>
            Title
          </th>
          <th>
            Status
          </th>
          <th>
            Created
          </th>
          <th>
            Changed
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="blog of blogs" :key="blog.id">
          <td>
            <nuxt-link :to="{ name: 'blog-id-edit', params: { 'id': blog.id }}">
              {{ blog.id }}
            </nuxt-link>
          </td>
          <td>
            {{ blog.title }}
          </td>
          <td>
            {{ blog.published ? 'Published' : 'Drafted' }}
          </td>
          <td>
            {{ blog.created | toDate }}
          </td>
          <td>
            {{ blog.changed | toDate }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
import Spinner from '@/components/LoadingSpinner'
export default {
  name: 'admin',
  middleware:"auth",
  layout: "default",
  components: { Spinner },
  data () {
    return {
      blogs: []
    }
  },
  async mounted () {
    const querySnapshot = await this.$fire.firestore.collection('blogs')
      .orderBy('created', 'desc')
      .get()
    querySnapshot.forEach((doc) => {
      this.blogs.push({
        id: doc.id,
        ...doc.data()
      })
    })
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
  }
}
</script>

<style lang="scss" scoped>
.new {
  display: block;
  color: blue !important;
  text-decoration: underline;

  // block mb-5 no-underline font-bold uppercase text-sm float-right
}
</style>
