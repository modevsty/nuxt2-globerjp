<template>
  <v-app>
    <div>
      <v-toolbar class="dp-sp-none">
        <v-toolbar-title class="headline text-uppercase md-5">
          <nuxt-link to="/" class="container-logo font-weight-bold black--text">
            <div class="primary--text text-capitalize">glober</div>
            <h1 style="display:none">
              glober - Services for International Students in Japan
            </h1>
          </nuxt-link>

        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="primary--text text-capitalize mr-3"
          @click.stop="login()"
          exact
          >login</v-btn
        >
      </v-toolbar>
    </div>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<style>
a {
  text-decoration: none;
}
</style>

<script>
export default {
  methods: {
    login() {
      if (this.$store.getters["isLoggedIn"]) {
        this.$router.push("/dashboard")
      } else {
        this.$router.push({path: '/login'});
      }
    }
  }
};
</script>