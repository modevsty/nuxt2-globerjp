<template>
  <v-app class="app-container" >
    <v-main class="main-container" >
      <Nuxt keep-alive />
    </v-main>
  </v-app>
</template>
<script>
export default {
  created() {
    this.$nuxt.$on('topEmitEmpty', ($event) => this.topEmitHandler($event))
  },
  methods: {
    topEmitHandler(vh) {
      document.documentElement.style.setProperty('--vh',`${vh}px`);
    }
  }
}
</script>
<style scoped>
.app-container {
  /* height: 100%; */
  background-color: yellow;
  /* max-height: calc(var(--vh, 1vh) * 100) !important; */
}
.main-container {
  /* height: 100%; */
  background-color: blue;
  /* max-height: calc(var(--vh, 1vh) * 100) !important; */
}
/* a {
  text-decoration: none;
  color: blue !important;
} */
</style>

