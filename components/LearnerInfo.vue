<template>
  <div>
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
    <v-row style="width: 100%;" class="pa-0 ma-0">
      <v-col class="d-flex justify-center pa-0">
        <div style="top:0;width: 100%;">
          <div
            class="d-flex justify-center top-all"
            style="width: 100%; overflow: hidden;height:fit-content"
          > 
            <!-- <v-img
              v-if="profile.backgroundImage && profile.backgroundImage.imageUrl"
              :src="imgFailed? '/img/default_background.jpg' :profile.backgroundImage.imageUrl"
              @error="imgFailed=true"
              style="object-fit: cover"
              height="100%"
              width="100%"
            />
            <v-img
              v-else
              style="object-fit: cover"
              src="/img/default_background.jpg"
              height="100%"
              width="100%"
            /> -->
            <div class="top-outer">
              <div class="top-container">
                <v-container class="top-container-inner">
                  <div class="top-inner">
                  <div class="profile-image-container">
                    <div
                      class="d-flex justify-center pa-0"
                      style="width: fit-content; position: relative; z-index: 100;"
                    >
                      <v-img
                        v-if="profile.avatarImage && profile.avatarImage.imageUrl"
                        :src="imgFailed? '/img/image-not-found.png' :profile.avatarImage.imageUrl"
                        @error="imgFailed=true"
                        lazy-src="/img/default_profile.png"
                        style="object-fit: cover"
                        height="180"
                        width="180"
                      />
                      <v-img
                        v-else
                        style="object-fit: cover"
                        src="/img/default_profile.png"
                        height="180"
                        width="180"
                      />
                    </div>
                  </div>
                  <div class="description-container" >
                    <div
                      class="description-inner"
                    >
                      <v-row>
                        <v-col class="pa-0">
                          <div class="description-card">
                            
                                <v-card-text class="description-name" v-if="profile.firstName && profile.firstName.replace(/\s/g, '').length">
                                  <span>{{ !profileShow || profileShow.realName ? profile.firstName+" "+profile.lastName : (profile.nickName? profile.nickName : profile.firstName)}}</span>
                                </v-card-text>
                                <!-- <v-card-text class="py-1 " v-if="profile.bio">
                                  <span class="description-field">ABOUT ME: </span><span>{{ profile.bio }}</span>
                                </v-card-text> -->
                                <v-card-text class="py-1 d-flex" v-if="profile.birthDate">
                                  <div class="description-field mr-4">
                                    Age</div> <div class="description-data">{{ getAgeGroupFromDOB(profile.birthDate) }}
                                  </div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profile.country">
                                  <div class="description-field mr-4">Country</div> <div class="description-data">{{  profile.country }}</div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profile.gender">
                                  <div class="description-field mr-4">
                                    Gender</div> <div class="description-data">{{ profile.gender[0].toUpperCase() + profile.gender.substring(1) }}
                                  </div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profileShow.university && profile.university.replace(/\s/g, '').length">
                                  <div class="description-field mr-4">
                                    University</div> <div class="description-data">{{ profile.university }}
                                  </div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profile.knows && profile.knows.length">
                                  <div class="description-field mr-4">
                                    Knows</div> <div class="description-data">{{ profile.knows.join(', ') }}
                                  </div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profile.learning && profile.learning.length">
                                  <div class="description-field mr-4">
                                    Learning</div> <div style="flex:1" class="description-data">{{ profile.learning.join(', ') }}
                                  </div>
                                </v-card-text>
                                <!-- <v-card-text class="py-1" v-if="profileShow && profileShow.degree && profile.degree">
                                  <span class="description-field">
                                    DEGREE: &nbsp;&nbsp;</span> <span class="description-data">{{ profile.degree }}
                                  </span>
                                </v-card-text>
                                <v-card-text class="py-1" v-if="profileShow && profileShow.major && profile.major && profile.major.replace(/\s/g, '').length">
                                  <span class="description-field">MAJOR: &nbsp;&nbsp;</span> <span class="description-data">{{ profile.major }}</span>
                                </v-card-text> -->
                                <v-card-text class="py-1 d-flex" v-if="profile.interests && profile.interests.length">
                                  <div class="description-field mr-4">Interests</div> <div class="description-data">{{ profile.interests.join(", ") }}</div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="profile.availability">
                                  <div class="description-field mr-4">
                                    Availability</div> <div  class="description-data green--text"> Looking for Language partners
                                  </div>
                                </v-card-text>
                                <v-card-text class="py-1 d-flex" v-if="!profile.availability">
                                  <div class="description-field mr-4 align-end">
                                    Availability</div> <div class="description-data red--text"> Currently unavailable
                                  </div>
                                </v-card-text>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  </div>
                </v-container>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-container>
      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Language Information
          </v-card-title>
          <v-card class="pa-3 pb-6">
            <v-row>
              <v-col cols="12" sm="6">
                <v-row v-if="profile.knows && profile.knows.length">
                  <v-col cols="12" class="pb-0">
                    <v-card-title class="py-0">
                      Language/s I know
                    </v-card-title>
                  </v-col>
                  <v-col class="pb-0" v-for="language of profile.knows" :key="language" cols="12">
                    <!-- <v-subheader> {{ language }}</v-subheader> -->
                    <v-card-text class="pb-0">
                      <v-slider
                        :label="language"
                        v-model="profile.languageLevel[language]"
                        :tick-labels="tickLabelsArray(profile.languageLevel[language])"
                        :max="3"
                        step="1"
                        ticks="always"
                        tick-size="4"
                        readonly
                      ></v-slider>
                      <!-- <div style="color:#000;font-size:18px;">{{ profile.knows[language] }}</div> -->
                    </v-card-text>
                  </v-col>
                </v-row>

                <v-row  v-if="profile.learning && profile.learning.length">
                  <v-col cols="12" class="pb-0">
                    <v-card-title class="py-0 pr-0" style="white-space: nowrap; overflow: visible">
                      Language/s I want to practice
                    </v-card-title>
                  </v-col>
                  <v-col class="pb-0" v-for="language of profile.learning" :key="language" cols="12">
                    <!-- <v-subheader> {{ language }}</v-subheader> -->
                    <v-card-text class="pb-0">
                      <v-slider
                      :label="language"
                        v-model="profile.languageLevel[language]"
                        :tick-labels="tickLabelsArray(profile.languageLevel[language])"
                        :max="3"
                        step="1"
                        ticks="always"
                        tick-size="4"
                        readonly
                      >
                      <template slot="thumb-label" slot-scope="props">
                        <span style="font-size:12px;">
                        {{ props.value }}
                        </span>
                      </template>
                      </v-slider>
                      <!-- <div style="color:#000;font-size:18px;">{{ profile.learning[language] }}</div> -->
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row  v-if="profile.bio">
                  <v-col cols="12">
                    <v-card-title class="py-0 pb-5">
                      About {{ !profileShow || profileShow.realName ? profile.firstName : (profile.nickName? profile.nickName : profile.firstName)}}
                    </v-card-title>
                    <v-card outlined class="mx-3">
                      <v-card-text>
                        {{profile.bio}}
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Contact {{ !profileShow || profileShow.realName ? profile.firstName : (profile.nickName? profile.nickName : profile.firstName)}}
          </v-card-title>
          <ChatLearner
          :value="alteredProfile"
          :learnerUserId="profile.id"
          :learnerName="!profileShow || profileShow.realName ? profile.firstName : (profile.nickName? profile.nickName : profile.firstName)"
          :currentUserId="user.uid"
          :userName="((!account.profileShow || account.profileShow.realName )? account.firstName+' '+account.lastName : (account.nickName? account.nickName : account.firstName))"
           />
          <!-- <ContactLearner :value="alteredProfile" /> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import moment from 'moment'
import Spinner from '@/components/LoadingSpinner'
import ChatLearner from '@/components/ChatLearner'
// import ContactLearner from '@/components/ContactLearner'
export default {
  components: {Spinner, ChatLearner},
  name: 'Post',
  props: {
    profile: {
      type: Object,
      required: true
    },
    profileShow: {
      type: Object,
      default: null
    }
  },
  created() {
     if (process.browser) {
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
     }
  },
  computed: {
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    user() {
      return this.$store.state.authUser
    },
    isSmallScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 900) ? false : true 
      }
      return true
    },
    alteredProfile() {
      return {...this.profile, 
      fromName: !this.account.profileShow || this.account.profileShow.realName ? this.account.firstName : (this.account.nickName? this.account.nickName : this.account.firstName),
      toName: !this.profileShow || this.profileShow.realName ? this.profile.firstName : (this.profile.nickName? this.profile.nickName : this.profile.firstName)
      }
    },
    
  },
  methods: {
    getAgeGroupFromDOB(value) {
      if(!value || !process.browser) {
        return ''
      }
      var date = moment(value);
      if (!date) {
        return ''
      }
      const years = moment().diff(value, 'years');

      switch (true) {
        case years < 25:
          return 'Under 25'
        case years < 35:
          return '25-34'
        case years < 46:
          return '35-45'
        default:
          return 'Over 45'
      }


    },
    tickLabelsArray(level) {
      if (!this.isSmallScreen) {
        return this.languageLabels
      }
      let array = [...this.tickLabels]
      array[level] = this.languageLabels[level]
      return array
    }
  },
  data() {
    return {
      error: null,
      success: null,
      imgFailed:false,
      languageLabels: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Native',
        ],
      tickLabels: [
        '',
        '',
        '',
        ''
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.top-all {
  background-image: url(/img/default_background.jpg);  // 'url(' + profile.backgroundImage && profile.backgroundImage.imageUrl?profile.backgroundImage.imageUrl:require('@/assets/images/default_background.jpg') + ')' 
  background-size: cover;
  .top-outer {
    width: 100%; 
    height: fit-content; 
    top: 0;
    @media screen and (max-width: 500px) {
      height: fit-content
    }
    .top-container {
      width: 100%;
      display: flex;
      padding: 20px 0;
      align-items: center;
      justify-content: flex-start;
      min-height: 400px;
      .top-container-inner {
        display: flex;
        @media screen and (max-width: 500px) {
          justify-content: center;
        }
        .top-inner {
          width: fit-content;
          display: flex;
          align-items: flex-start;
          height: fit-content;
          background-color: rgba(255,255,255,0.8);
          border-radius: 5px;
          padding: 20px;
          @media screen and (max-width: 500px) {
            align-items: center;

            flex-direction: column;
          }
          .profile-image-container {
            display: flex;
            height: 100%;
            padding-right: 20px;
            @media screen and (max-width: 500px) {
              justify-content: center;
              padding-right: 0
            }

          }
          .description-container {
            max-width: 350px;
            @media screen and (max-width: 500px) {
              // max-width: 100%;
              margin-top: 0px;
            }
            .description-inner {
              
              .description-card {

                @media screen and (max-width: 500px) {

                  margin-top: 20px;
                }
                .description-name {
                  padding-top: 20px;
                  padding-bottom: 10px;
                  @media screen and (max-width: 500px) {
                    text-align: center;
                  }
                  span {
                    font-size: 24px;
                    color: black;
                    font-weight: 700;
                  }
                }
                .description-field {
                  font-size: 21px;
                  color: #1976d2;
                  font-weight: 700;
                }
                .description-data {
                  font-size: 16px;
                  font-weight: 500;
                }
              }

            }
          }
        }
      }


    }
  }
}

</style>
<style>

.v-slider__ticks-container .v-slider__tick .v-slider__tick-label {
  font-size: 12px;
  font-weight: bold;
  transform: translate(-50%);
}

</style>
<style lang="scss">
.v-input__slider  {
  label {
    font-size: 14px;
     min-width: 80px;
     max-width: 80px;
  }
 
}
</style>