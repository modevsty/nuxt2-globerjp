<template>
<v-container>
<Spinner v-if="!isMounted" style="min-height: 90px;"/>
<div v-else>
  <v-alert style="position:absolute;left: 50%;
    z-index:100;
    bottom: 50px;
    transform: translate(-50%, -50%);
    margin: 0 0 auto; " type="success" :value="!!success">{{ success }}</v-alert>
  <v-alert style="position:absolute;left: 50%;
    z-index:100;
    bottom: 50px;
    transform: translate(-50%, -50%);
    margin: 0 0 auto; " type="error" :value="!!error">{{ error }}</v-alert>

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
  <div v-if="openDialog">
    <LearnerForm :newInfoDialog="openDialog"/>
  </div>
  <div class="event-container" v-else>
    <Spinner v-if="isLoading && isMounted" style="min-height: 90px;"/>
    <div v-else>
      <h1 class="d-flex justify-center align-center mt-7 mb-7 mt-md-9 jgreyest--text" style="font-weight:500;text-align:center;width:100%"> <span style="color:1#64BDDC">Search for Language partners</span> </h1>
      <div v-if="learners && learners.length">
        <v-row
          align="center"
          class="justify-center justify-md-start event-container-row"
        >
          <v-col
            v-for="learner in learners"
            :key="learner.id"
            class="xs event-container-col"
            cols="12"
            xl="3"
            lg="4"
            md="6"
            sm="9"
          >
            <v-card
              :ripple="!isMobileScreen? true : false"
              :to="`/learners/learner/${learner.id}`"
              nuxt
              style="min-height:260px;"
              class="pa-0 pr-3 event-card"
              hover
            >
              <div v-if="!!learner.avatarImage && learner.avatarImage.imageUrl" class="pa-0 event-card-inner">
                <v-img
                  contain
                  transition="xxx"
                  :lazy-src="lazyGif"
                  :src="imgFailed? '/img/default_profile.png' :learner.avatarImage.imageUrl"
                  alt="event Post Image"
                  class="event-card-img"
                  position="top"
                  @error="imgFailed=true"
                />
              </div>
              <div v-else class="pa-0 event-card-inner">
                <v-img
                  contain
                  position="top"
                  class="event-card-img"
                  alt="Image Not Found Image"
                  src="/img/default_profile.png"
                />
              </div>
              <div class="py-3" style="flex:1">
                <v-card-text
                  v-if="learner.firstName && learner.firstName.replace(/\s/g, '').length"
                  class="pt-1 pb-1 font-weight-bold jgreyest--text px-6 card-title"
                >
                  {{ !learner.profileShow || learner.profileShow.realName ? learner.firstName+" "+learner.lastName : (learner.nickName? learner.nickName : learner.firstName)}}
                </v-card-text>
                <v-card-text
                  v-if="
                      learner.age
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px;"
                >
                  <span
                    class="mt-1 d-flex"
                  >
                  <div  style="font-weight: bold"> Age: &nbsp;</div>
                  <div>{{ learner.age }}</div>
                  
                  </span>

                </v-card-text>
                <v-card-text
                  v-if="
                      learner.knows && learner.knows.length
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px;"
                >
                  <!-- <v-icon color="jblackest" size="18">mdi-map-marker</v-icon> -->
                  <!-- <span class="font-weight-bold">
                    Location:
                  </span> -->
                  <span
                    class="mt-1"
                  >
                  <div style="font-weight: bold"> knows: &nbsp; </div>
                  <div>{{ learner.knows.join(', ') }}</div>
                  </span>
                  

                </v-card-text>
                <v-card-text
                  v-if="learner.learning"
                  class="pt-2 pb-1 px-6 jgreyer--text"
                  style="font-size: 16px;"
                >
                  <span class="mt-1">
                    <div  style="font-weight: bold"> Learning: &nbsp;</div>
                    <div> {{ learner.learning.join(', ')}}</div>
                  
                    
                  </span>
                </v-card-text>
                <v-card-text
                  v-if="learner.availability"
                  class="pt-2 pb-1 px-6 blue--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    Available to be contacted
                  </span>
                </v-card-text>
                <v-card-text
                  v-if="!learner.availability"
                  class="pt-2 pb-1 px-6 red--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    Currently Unavailable
                  </span>
                </v-card-text>
                <!-- <v-card-text
                    class="text-center pa-4 card-details"
                  >
                    See Details
                  </v-card-text> -->
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-card-text class="text-center">
          No learners found.
        </v-card-text>

      </div>
      <!-- <v-row align="center">
      <v-col cols="12" class="col-sm-6 col-md-4" v-for="person in people" :key="person.id">
        <v-card class="mx-2" width="450px">
          <v-row>
            <v-col cols="6">
              <v-img :src="person.image" aspect-ratio="0.6" />
            </v-col>
            <v-col cols="6">
              <v-card-text>
                <h3>{{ person.name }}</h3>
                <p>Age: {{ person.age }}</p>
                <p>Knows: {{ person.knows.join(', ') }}</p>
                <p>Learning: {{ person.learning.join(', ') }}</p>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row> -->
    </div>
  </div>
  </div>
  </div>
</v-container>
</template>

<script>
import LearnerForm from "../../components/FormLearner.vue"
import Spinner from '@/components/LoadingSpinner'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

export default {
  head: {
    title: 'glober learners'
  },
  components: { Spinner, LearnerForm },
  data() {
    return {
      success: null,
      error: null,
      lazyGif: 'data:image/gif;base64,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',
      imgFailed: false,
      openDialog: false,
      isLoading: false,
      isMounted: false,
      learners: [
        // {
        //   id: 1,
        //   firstName: 'John',
        //   lastName: 'Wheaton',
        //   nickName: '',
        //   profileShow: {
        //     realName: true
        //   },
        //   age: 32,
        //   avatarImage: {
        //     imageUrl: 'https://picsum.photos/id/1/300/480',
        //   },
        //   knows: ['English', 'Spanish'],
        //   learning: ['French', 'German'],
        //   availability: true
        // },
        // {
        //   id: 2,
        //   firstName: 'Jane',
        //   lastName: 'Doosh',
        //   nickName: '',
        //   profileShow: {
        //     realName: true
        //   },
        //   age: 28,
        //   avatarImage: {
        //     imageUrl: 'https://picsum.photos/id/2/300/480',
        //   },
        //   knows: ['English'],
        //   learning: ['Spanish'],
        //   availability: true
        // },
        // {
        //   id: 3,
        //   firstName: 'John',
        //   lastName: 'Wheaton',
        //   nickName: '',
        //   profileShow: {
        //     realName: true
        //   },
        //   age: 32,
        //   avatarImage: {
        //     imageUrl: 'https://picsum.photos/id/3/300/480',
        //   },
        //   knows: ['English', 'Spanish'],
        //   learning: ['French', 'German'],
        //   availability: true
        // },
        // {
        //   id: 4,
        //   firstName: 'Jane',
        //   lastName: 'Doosh',
        //   nickName: '',
        //   profileShow: {
        //     realName: true
        //   },
        //   age: 28,
        //   avatarImage: {
        //     imageUrl: 'https://picsum.photos/id/4/300/480',
        //   },
        //   knows: ['English'],
        //   learning: ['Spanish'],
        //   availability: true
        // },
      ]
    }
  },
  mounted() {
    if (!this.isAccountComplete) {
      this.openDialog = true
    }
    this.$nuxt.$on('closeDialog', ($event) => {
      this.openDialog = false
    })
    this.$nuxt.$on('success', ($event) => {
      this.success = $event
      setTimeout(()=>{
        this.success = null
      },3000)
    })
    this.$nuxt.$on('error', ($event) => {
      this.error = $event
      setTimeout(()=>{
        this.error = null
      },3000)
    })
    this.isMounted = true
  },
  async created() {
    if (this.user) {
      await this.getLearners()
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'learners') {
        await this.getLearners()
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
    isAccountComplete() {
      return this.account && this.account.birthDate
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
  methods: {
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    async getLearners() {
      this.isLoading = true
      let promises = await this.$fire.firestore.collection('learners')
          .where('userId', '!=', this.user.uid)
          .get()
          .then((querySnapshot) => {
            let out = []
            querySnapshot.forEach((res) => {
              let id = res.id
              out.push(
                this.$fire.firestore.collection('users').doc(id).get()
              )
            })
            return out
          })
      let learners = await Promise.all(promises)
          .then((querySnapshot) => {
            let out = []
            querySnapshot.forEach((res) => {
              let id = res.id
              let data = res.data()
              out.push(
                {
                  id,
                  ...data
                }
              )
            })
            return out
          })
      this.isLoading = false;
      this.learners = learners
      
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~/assets/scss/global.scss";
.index-container {
  margin-bottom: 40px;
}
.event-container {
  .event-container-row {
    .event-container-col {
      .event-card {
        border-radius: 5px;
        display: flex;
        .event-card-inner {
          height: inherit;
          width: 130px;
          display: flex;
          justify-content: center;
          overflow: hidden;
          // @media screen and (max-width: 759px) {
          //   width: 30vw;
          // }
          @media screen and (max-width: 959px) {
            width: 130px;
          }
          @media screen and (max-width: 599px) {
            width: 130px;
          }
          .event-card-img {
            width: 100%;
            height: 100%;
            // @media screen and (max-width: 759px) {
            //   width: 30vw;
            // }
            // @media screen and (max-width: 599px) {
            //   width: 150px;
            // }
            // object-fit: contain;
            // border-radius: 5px 0 0 5px;
          }
        }
      }
    }
  }
}
.card-title {
  font-size: 21px;
  line-height: 1.5rem;
  // padding: 15px 24px 4px;
  @media screen and (max-width: 599px) {
    font-size: 18px;
    line-height: 1.4rem;
    padding-top: 15px;
  }
}
// .tag-container {
//   padding: 10px;
// }
// .card-details {
//   font-size: 20px;
//   @media screen and (max-width: $sp-max-width) {
//     font-size: 16px;
//   }
// }
</style>

