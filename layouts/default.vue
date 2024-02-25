<template>
  <v-app>
    <Navigation v-if="menuVisible" :style="isHeaderFixed?{
      position: 'fixed',
      top: '0',
      width: '100%'
    }:{}" id="top-navigation" style="z-index:10;" />
    <v-main style="padding-left: 0 !important;">
      <Nuxt keep-alive :keep-alive-props="{exclude: excludedPages}" />
    </v-main>

    <v-bottom-navigation v-if="menuVisible" app class="navigation-bottom" style="z-index:4; display: flex; align-items:center; justify-content:center;">

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

      <v-btn to="/faq" v-show="user" nuxt
      style="height: 100%;"
        class="white primary--text"
        >Support
        <v-icon>mdi-charity</v-icon>
      </v-btn>

      <v-btn to="/chat" v-show="user && allowChat" nuxt
      style="height: 100%;"
        class="white primary--text"
        >Chat
        <v-icon>mdi-chat-processing</v-icon>
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
      menuVisible: true,
      excludedPages: [
        'admin',
        'organizer',
        'chat',
        'pages/chat.vue',
        'pages/admin/index.vue',
        'pages/organizer/index.vue',
        'pages/admin/accounts/index.vue',
        'pages/admin/blogs/index.vue',
        'pages/admin/blogs/new.vue',
        'pages/admin/events/index.vue',
        'pages/admin/events/event/index.vue',
        'pages/organizer/events/index.vue',
        'pages/organizer/events/event/index.vue',
        'pages/admin/events/event/_id.vue',
        'pages/organizer/events/event/_id.vue',
        'pages/blog/_id/edit.vue',
      ],
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      error: null,
      success: null,
      allowChat: false,
      isHeaderFixed: false
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
   watch: {
    async $route(to, from) {
      if (to.name !== 'chat') {
        this.menuVisible = true
        this.isHeaderFixed = false
      } else{
        this.isHeaderFixed = true
      }
    },
  },
  created() {
    if(this.$route.name === 'chat') {
      this.isHeaderFixed = true
    }
    this.$nuxt.$on('topEmit', ($event) => this.topEmitHandler($event))
  },
  async mounted() {
    if (this.user) {
      const query = await this.$fire.firestore.collection('chatUsers').doc(this.user.uid).get()
      this.allowChat = query.exists
    }
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
    },
    topEmitHandler(val) {
      this.menuVisible = val
      this.$forceUpdate()
    },
  }
};
</script>