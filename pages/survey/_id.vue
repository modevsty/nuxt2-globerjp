<template>
  <client-only>
    <v-container v-if="!user">
        <h1>
          You must be logged in to view this page.
        </h1>
        <v-btn
          class="pa-0 blue--text"
          style="text-transform: unset !important; font-size: 16px !important;"
          @click="handleJoin()"
          text
          >Click here to Join</v-btn
        >
      </v-container>
    <div v-else>
      <div class="mt-5" v-if="pageLoaded">
        <div v-if="isSurveyExpired">
          <h1 class="d-flex justify-center align-center">This Survey has expired</h1>
        </div>
        <div class="poll-container">
          <div class="poll-container-inner">
            <div class="d-flex justify-center align-center" style="width: 100%;">
              <h1 class="mx-5 mt-2 mb-3 mt-md-3 blue--text text-decoration-underline" style="text-align:center;max-width:100%; width:600px;"> 
                {{survey.title}} 
              </h1>
            </div>
            <div v-for="(pollId, i) in survey.polls" :key="i">
              <PollBox :id="pollId" :expireAt="survey.expireAt" :isSurveyExpired="isSurveyExpired" @isExpired="isExpiredHandler" />
            </div>
          </div>
        </div>
      </div>
      <Spinner v-else color="blue"></Spinner>
    </div>
  </client-only>
</template>
<script>
import Spinner from '@/components/LoadingSpinner'
import PollBox from '@/components/PollBox/view'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  // middleware: "auth",
  name: 'survey',
  layout: "default",
  components: { Spinner, PollBox},
  data() {
    return {
      error: null,
      success: null,
      survey: null,
      pageLoaded: false,
      loadingFailed: false,
      isSurveyExpired: false
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

  async mounted() {
    this.$nextTick(() => {
        this.$nuxt.setLayout('default')
    })
    if (this.user) {
      await this.getInfo()
      this.computeIsExpired()
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'survey-id') {
        await this.getInfo()
        this.computeIsExpired()
      }
    },
  },


  methods: {
    isExpiredHandler(val) {
      this.isSurveyExpired = val
    },
    computeIsExpired() {
      const diffInMs = parseInt(this.survey.expireAt) - new Date()
      this.isSurveyExpired = (diffInMs < 0)
    },
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    async getInfo() {
      try {
        let res = await this.$fire.firestore.collection('surveys')
        .doc(this.$route.params.id)
        .get()

        if (res.exists) {
          let id = res.id
          let data = res.data()
          this.survey = {
            id,
            ...data
          }
          
        
        } else {
          this.$nuxt.error({ statusCode: 404, message: 'Poll not found' })
          return
        }
      } catch(err) {
        this.$nuxt.error({ statusCode: 404, message: 'Poll not found' })
        return
      }
      this.pageLoaded = true
    },
  }
};
</script>

