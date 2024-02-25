<template>
  <v-container>
    <h1>
      This page does not exist.
    </h1>
    Go to <NuxtLink class="primary--text" color="blue" to="/">
        Home page
    </NuxtLink>
  </v-container>
</template>
<script>
  export default {
    middleware({ store, route, redirect }) {
      if(route.params.id) {
        return redirect(`/survey/${route.params.id}/`)
      }
    }
  }
</script>