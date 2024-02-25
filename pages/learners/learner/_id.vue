<template>
  <div>
  <Spinner color="blue" v-if="isLoading || !isMounted"></Spinner>
  <client-only v-else>
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
    <div v-else-if="openDialog">
      <LearnerForm :newInfoDialog="openDialog"/>
    </div>
    <div v-else-if="profile">
      <LearnerInfo :profile="profile" :profileShow="profileShow" />
    </div>
    <!-- <div v-else>
      <Spinner color="blue"></Spinner>
    </div> -->
  </client-only>
  </div>
</template>
<script>
import LearnerInfo from "../../../components/LearnerInfo.vue"
import LearnerForm from "../../../components/FormLearner.vue"
import Spinner from '@/components/LoadingSpinner'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

export default {
  head() {
    return { title: (this.profileShow && this.profile && 'glober learner | '+ ((!this.profileShow || this.profileShow.realName ? this.profile.firstName+" "+this.profile.lastName : (this.profile.nickName? this.profile.nickName : this.profile.firstName)))) || 'glober learner'}
  },
  // middleware: "auth",
  components: { Spinner, LearnerInfo, LearnerForm},
  data() {
    return {
      openDialog: false,
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
    isAccountComplete() {
      return this.account.birthDate
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    },
  },
  mounted() {
    this.isMounted = true
    if (!this.isAccountComplete) {
      this.openDialog = true
    }
    this.$nuxt.$on('closeDialog', ($event) => {
      this.openDialog = false
    })
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
    // async $route(to, from) {
    //   if (to.name === 'learners-learner-id') {
    //     await this.getInfo()
    //   }
    // },
  },

  methods: {
    isProfileComplete(account) {
      return account.birthDate
    },
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
          if (!this.isProfileComplete(data)) {
            this.openDialog = true
            // this.$nuxt.error({ statusCode: 404, message: 'Profile not found' })
            return
          }
          profile = {
            id,
            // knows: [
            //   'English',
            //   'Japanese',
            //   'Nepalese'
            // ],
            // learning: [
            //   'Spanish',
            //   'Korean'
            // ],
            // languageLevel:{
            //   'English': 0,
            //   'Japanese': 1,
            //   'Nepalese': 3,
            //   'Spanish': 0,
            //   'Korean': 2
            // },
            // birthDate: '2000-07-08',
            // bio: "let's be friends",
            ...data,
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
