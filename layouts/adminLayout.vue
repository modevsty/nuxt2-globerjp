<template>
  <v-app>
    <Navigation style="z-index:10;" />
    <v-main style="padding-left: 0 !important">
      <Nuxt/>
    </v-main>

    <v-bottom-navigation app class="navigation-bottom" style="z-index:4; display: flex; align-items:center; justify-content:center;">

      <v-btn to="/" nuxt
        style="height: 100%;"
        class="white primary--text"
        >Home
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn to="/feed" nuxt
      style="height: 100%;"
        class="white primary--text"
        >Feed
        <v-icon>mdi-rss</v-icon>
      </v-btn>

      <v-btn to="/dashboard" nuxt
      style="height: 100%;"
        class="white primary--text"
        >My Page
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn to="/faq" v-show="user && isAdmin" nuxt
      style="height: 100%;"
        class="white primary--text"
        >FAQ
        <v-icon>mdi-frequently-asked-questions</v-icon>
      </v-btn>
      

      <!-- <v-btn to="/admin" v-if="user && this.isAdmin" nuxt
        class="white primary--text"
        >Admin
        <v-icon>mdi-account</v-icon>
      </v-btn> -->

    </v-bottom-navigation>
  </v-app>
</template>

<style>
a {
  text-decoration: none;
}
</style>

<script>
import Navigation from "@/components/Navigation";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  components: {
    Navigation,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      error: null,
      success: null
    };
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
    ...mapGetters({
      isAdmin: "account/ISADMIN",
    }),
  },
  methods: {
    linkTo(address) {
      this.$router.push({ path: `/${address}` });
    },
    login() {
      if (this.$store.getters["isLoggedIn"]) {
        this.$router.push("/dashboard")
      } else {
        this.$router.push({path: '/login'});
      }
    },
    async logout() {
      await this.$fire.auth.signOut()
      this.$router.push({path: '/'});
    }
  }
};
</script>