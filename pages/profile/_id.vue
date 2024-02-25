<template>
  
  <div>
  <Spinner color="blue" v-if="isLoading || !isMounted"></Spinner>
  <client-only>
    <v-container v-if="!user">
      <h1>
        You must be logged in to view this page.
      </h1>
      <v-btn
        color="primary"
        class="pa-0"
        style="text-transform: unset !important; font-size: 16px !important;"
        @click="handleJoin()"
        text
        >Click here to Join</v-btn
      >
    </v-container>
    <div v-else>
      <UserInfo v-if="profile" :profile="profile" :profileShow="profileShow" />
    </div>
  </client-only>
  </div>
</template>
<script>
import UserInfo from "../../components/UserInfo.vue"
import Spinner from '@/components/LoadingSpinner'

export default {
  head() {
    return { title: (this.profileShow && this.profile && 'glober profile | '+ ((!this.profileShow || this.profileShow.realName ? this.profile.firstName+" "+this.profile.lastName : (this.profile.nickName? this.profile.nickName : this.profile.firstName)))) || 'glober profile'}
  },
  // middleware: "auth",
  components: { Spinner, UserInfo},
  data() {
    return {
      isMounted: false,
      error: null,
      success: null,
      profile: null,
      profileShow: null,
      isLoading: false,
      loadingFailed: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
  },
  mounted() {
    this.isMounted = true
  },

  async created() {
    if (this.user) {
      await this.getInfo()
    }
  },
  watch: {
    isMounted() {
      this.$nextTick(() => {
         this.$nuxt.setLayout('default')
      })
    },
    async $route(to, from) {
      if (to.name === 'profile-id') {
        await this.getInfo()
      }
    },
  },

  methods: {
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    async getInfo() {
      this.isLoading = true;
      let profile = {}
      let profileShow = null
      try {

        let res = await this.$fire.firestore.collection('users')
        .doc(this.$route.params.id)
        .get()

        if (res.exists) {
          let id = res.id
          let data = res.data()
          profile = {
            id,
            ...data
          }
          profileShow = data.profileShow? data.profileShow : null 
        } else {
          this.$nuxt.error({ statusCode: 404, message: 'User not found' })
          return
        }
      } catch(err) {
        this.$nuxt.error({ statusCode: 404, message: 'User not found' })
        return
      }
      
      this.isLoading = false;
      this.profile = profile;
      this.profileShow = profileShow;
      
    },
  }
};
</script>
