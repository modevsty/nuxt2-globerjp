<template>
  <!-- <Spinner color="white" v-if="!user"></Spinner> -->
    <div class="poll-container">
      <div v-if="pageLoaded" class="poll-container-inner">
      <GloberPoll :myOriginalAnswer="myAnswer" :pollAnswers="pollAnswers" :poll="poll" :expireAt="expireAt" @isExpired="isExpiredHandler" :isSurveyExpired="isSurveyExpired" />

      </div>
    </div>
</template>
<script>
import Spinner from '@/components/LoadingSpinner'
import GloberPoll from '@/components/GloberPoll'
export default {
  // middleware: "auth",
  components: { Spinner, GloberPoll},
  props: {
    id: {
      type: String,
      required: true
    },
    expireAt: {
      type: String,
      default: ''
    },
    isSurveyExpired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myAnswer: null,
      error: null,
      success: null,
      poll: null,
      pageLoaded: false,
      loadingFailed: false,
      pollAnswers: []
    };
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
    isChoice() {
      return this.poll.type === 'multi-choice' || this.poll.type === 'single-choice'
    },
  },

  async mounted() {
    if (this.user) {
      await this.getInfo()
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'tools-polls-id') {
        await this.getInfo()
      }
    },
  },


  methods: {
    isExpiredHandler(val) {
      this.$emit('isExpired',val)
    },
    async getInfo() {
      try {
        let res = await this.$fire.firestore.collection('polls')
        .doc(this.id)
        .get()

        if (res.exists) {
          let id = res.id
          let data = res.data()
          this.poll = {
            id,
            ...data
          }
          
          if (this.isChoice) {
            let querySnapShot = await this.$fire.firestore.collection('pollAnswers')
              .where('pollId','==',this.poll.id)
              .get()
            
            if (querySnapShot.size) {
              querySnapShot.docs.forEach(doc => {
                const id = doc.id
                const data = doc.data()
                if (data.userId === this.user.uid) {
                  this.myAnswer = {id,...data}
                } else {
                  this.pollAnswers.push({
                    id, ...data
                  })
                }
                
              })
            }
            
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

