<template>
  <div>
    <Spinner v-if="!pageLoaded" />
    <client-only>
    <div class="event-container d-flex flex-column align-center justify-center pa-3" style="width: 100%">
      <v-card class="disable-tap-zoom" v-if="pageLoaded" style="width: min(100%, 800px)" >
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
          <!-- <v-carousel
            height="380px"
            hide-delimiter-background
            :show-arrows="eventTopImages.length > 1"
            :cycle="false"
            touchless
            hide-delimiters>
            <v-carousel-item 
              v-for="(item, index) in eventTopImages" 
              :key="index">
              <v-img
                contain
                :src="imgFailed? '/img/image-not-found.png' :item.imageUrl"
                @error="imgFailed=true"
                min-height="380px"
                max-height="380px"
              ></v-img>
            </v-carousel-item>
          </v-carousel> -->
          <div class="pa-2 pb-0 pa-sm-4 pb-sm-0 pa-md-8 pb-md-0">
            <Carousel
              :starting-image="0"
              :thumbnailWidth="700"
              :images="eventTopImages"
              :auto-slide-interval="0"
              :show-progress-bar="false"
              :eager="true"
            ></Carousel>
          </div>

          <v-container class="pt-4 pt-md-5 pa-2 pa-sm-4 pa-md-8;">
            <v-row class=" d-flex align-center justify-center">
              <v-col class="pt-0" cols="12" sm="11">
                <v-card-title class="text-h5" style="word-break:break-word;text-align:center;"> {{ event.title }} </v-card-title>
                <v-card-subtitle v-if="isHtml(event.description)" class="text-body-1 content" v-html="event.description" style="padding-top:10px;white-space:pre-wrap;word-break:break-word;"
                ></v-card-subtitle>
                <v-card-subtitle v-else class="text-body-1 content" v-html="event.alteredDescription" style="padding-top:10px;white-space:pre-wrap;word-break:break-word;"
                ></v-card-subtitle>
                <v-card-text>
                  <p class="text-body-1 d-flex" v-if="event.isOnline">■ Location: Online</p>
                  <p class="text-body-1 d-flex" v-else-if="event.location">■ Location: {{ event.location }}</p>
                  <p class="text-body-1 d-flex" v-if="startingTime">■ Starting time: {{ startingTime }}</p>
                  <p class="text-body-1 d-flex" v-if="endingTime">■ Ending time: {{ endingTime }}</p>
                  <p class="text-body-1 d-flex" v-if="duration">■ Duration: {{ duration }}</p>
                  <p class="text-body-1 d-flex" v-if="deadlineString">■ Deadline to register: {{ deadlineString }}</p>
                  <p class="text-body-1 d-flex" v-if="event.hasAttendeeLimit && event.attendeeLimit">■ Maximum Capacity: {{ event.attendeeLimit }} {{ event.attendeeLimit > 1 ? "Participants" : "Participant"}}</p>
                  <v-chip v-for="tag of event.tags" :key="tag" class="tag">
                    {{ tag }}
                  </v-chip>
                  <div v-if="this.event.formSchema && this.event.formSchema.length > 1 && !this.userAlreadyRegistered && !this.isPassedDeadline">
                    <p class="text-body-1 pt-5 font-weight-bold" style="font-size: 16px">Please fill in the form below to register:</p>
                    <client-only>
                      <FormulateForm
                        name="customEventForm"
                        class="d-flex justify-center flex-column"
                        style="width: 100%;"
                        ref="customEventForm"
                        v-model="customFormData"
                        @created="onFormCreated"
                        @submit="customFormSubmitHandler"
                        @failed-validation="customFormFailedValidationHandler"
                        :schema="event.formSchema"
                      />
                    </client-only>
                  </div>
                  <div class="pb-3" v-if="this.event.formSchema && this.event.formSchema.length > 1 && this.user && this.userAlreadyRegistered && Object.keys(customFormValues).length">
                    <h3 class="text-body-1 pt-5 font-weight-bold pb-3" style="font-size: 16px;">My Answers:</h3>
                    <div class="mb-7" v-for="(val, key, i) in customFormValues" :key="i">
                      <div class="d-flex flex-column" v-if="customFormElementNameToObjDict[key].type == 'file'">
                        <div style="font-weight: 600; letter-spacing: 0.0071428571em; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">{{ customFormElementNameToObjDict[key].label }} </div>
                        <v-btn @click="downloadMe(customFormValues[key].url)"
                          icon
                          color="blue"
                          >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </div>
                      <client-only v-else>
                        <FormulateInput
                          v-model="customFormValues[key]"
                          disabled
                          ref="customEventFormAnswers"
                          @hook:created="onFormAnswersMounted"
                          @hook:destroyed="onFormAnswersDestroyed"
                          :options="customFormElementNameToObjDict[key].options"
                          :type="customFormElementNameToObjDict[key].type"
                          :label="customFormElementNameToObjDict[key].label"
                          :name="customFormElementNameToObjDict[key].name"
                        />
                      </client-only>
                    
                    
                  </div>
                  </div>
                  <v-card-actions class="px-0 pb-8 d-flex flex-column flex-sm-row align-start">
                    <v-btn
                      v-if="user && !userAlreadyRegistered"
                      class="blue white--text"
                      :disabled="isRegistering || isUnRegistering || isPassedDeadline || isEventFull"
                      @click="validateRegistration()"
                      >{{ isPassedDeadline? "Event Past Deadline" : (isEventFull ? "Event Full" : "Register")}}</v-btn
                    >
                    
                    <v-btn
                        v-else-if="user"
                        @click="e => {confirmDialog = true}"
                       
                        class="grey white--text"
                        :disabled="isRegistering || isUnRegistering || isPassedDeadline"
                        >{{ isPassedDeadline? "Event Past Deadline" : "Unregister" }}

                      </v-btn>
 


                    <v-btn
                      v-else
                      class="white--text primary"
                      @click="handleJoin()"
                      >Click here to Join</v-btn
                    >
                      <v-dialog
                        :retain-focus="false"
                          v-model="confirmDialog"
                          max-width="290"
                        >
                          <v-card>
                            <v-card-title class="text-h6">
                              Are you sure?
                            </v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="blue darken-1"
                                text
                                 @click="e => {handleUnRegistration(event.id); confirmDialog = false}"
                              >
                                Yes
                              </v-btn>
                                <v-btn
                                color="blue darken-1"
                                text
                                @click="e=> {confirmDialog = false}"
                              >
                                No
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                    <v-spacer class="mb-3" style="max-width: 15px;"></v-spacer>
                    <v-btn ref="calendarBtn" v-if="!isPassedDeadline" @click="addToCalendar" class="mx-0">
                      Add to Calendar
                    </v-btn>
                  </v-card-actions>
                  <div class="d-flex justify-space-between align-center">
                    <h2 style="margin-bottom: 0">{{"Attendees" + " (" + attendees.length + ")"}}</h2>
                    <div>
                    <v-btn style="height: fit-content;" icon v-if="pageLoaded && user && isAdmin" @click="e=> {splitterDialog = true}">
                      <v-icon color="black">mdi-plus-circle</v-icon>
                    </v-btn>
                    <v-btn style="height: fit-content;" icon v-if="pageLoaded && user && (userAlreadyRegistered || isAdmin)" @click="e => { getOwnEventImages($route.params.id).then(()=>{this.imageDialog = true}) } ">
                      <v-icon color="blue">mdi-plus-circle</v-icon>
                    </v-btn>
                   
                    </div>
                  </div>
                  <v-card v-if="attendees.length" outlined class="my-5" style="max-height: 170px; overflow-y: scroll;scrollbar-width: thin;">
                  <v-list class="py-0">
                    <v-list-item nuxt-link class="black--text" :to="`/profile/${attendant.id}/`" v-for="attendant of attendees" :key="attendant.id"
                      ><v-list-item-avatar
                        ><v-icon>mdi-account</v-icon></v-list-item-avatar
                      ><v-list-item-title v-if="(attendant.firstName || attendant.lastName) && (attendant.firstName.replace(/\s/g, '').length || attendant.lastName.replace(/\s/g, '').length)">{{
                        (!attendant.profileShow || attendant.profileShow.realName) ? attendant.firstName+" "+attendant.lastName : (attendant.nickName? attendant.nickName : attendant.firstName)
                      }}</v-list-item-title>
                      <v-list-item-title v-else>{{
                        "anonymous"
                      }}</v-list-item-title>
                      <v-list-item-action-text
                        v-if="user && attendant.id === user.uid"
                        >YOURSELF</v-list-item-action-text
                      >
                    </v-list-item>
                  </v-list>
                  </v-card>
                  <p v-else>Be the first one to register!</p>
                </v-card-text>
              </v-col>
            </v-row>
          </v-container>
      </v-card>
      <v-card  v-if="
                eventImagesAll.length
              "
              class="mt-5 mt-md-7 px-0 pb-5 pt-0 px-sm-5" style="width: min(100%, 800px)">
        <div class="d-flex justify-space-between align-center mb-3">
        <v-card-title>Event Images</v-card-title>
        <v-btn style="height: fit-content;" icon v-if="pageLoaded" @click="e => {fullImageDialog = true } ">
                  <v-icon color="black">mdi-fullscreen</v-icon>
                </v-btn>
        </div>
        <v-row>
            <v-col
              v-if="
                eventImagesAll
              "
              class="pt-0"
              cols="12"
              style="overflow:visible"
            >
              <CarouselAuto
              :thumbnailWidth="500"
                :starting-image="0"
                :images="eventImagesAll"
              :auto-slide-interval="0"
              :show-progress-bar="true"
              :eager="true"
              ></CarouselAuto>
              <!-- <v-carousel
                light
                :continuous="true"
                :cycle="false"
                :height="eventImagesArray.length < 2 ? 350 : 400"
                style="width:min(100%,800px); color: white;over-flow:visible"
                class="d-flex justify-center align-center"
                hide-delimiter-background
                :show-arrows="eventTopImages.length > 1"
                hide-delimiters>
                <v-carousel-item 
                  v-for="(image, index) in eventImagesArray"
                  :key="index">
                  <v-img
                    contain
                    style="width:min(calc(100vw - 24px),800px)"
                    :src="imgFailed? '/img/image-not-found.png':image.imageUrl"
                    @error="imgFailed=true"
                    min-height="350px"
                    max-height="350px"
                  ></v-img>
                </v-carousel-item>
              </v-carousel> -->
            </v-col>
          </v-row>
      </v-card>
        <v-dialog
            scrollable
            fullscreen
            persistent
            v-if="fullImageDialog"
            v-model="fullImageDialog"
            max-width="800">
          <v-card dark class="pa-3 pa-sm-5" style="width: 100%;border-radius: 0">
            <v-card-actions>
            <v-btn
              style="position: absolute; top: 0; right: 0;"
              icon
              color="black"
              class="white--text"
              dark
              @click.stop="closeFullImageDialog"
            >
                                  
              <v-icon color="white">mdi-window-close</v-icon>

            </v-btn>
            </v-card-actions>
          <v-card-text class="d-flex justify-center align-center pa-0">
            <div  v-if="
                eventImagesAll.length
              "
              class="ma-0 pa-0" style="width: 100%">
            <v-row style="width: 100%; margin:0">
                <v-col
                  v-if="
                    eventImagesAll
                  "
                  class="pa-0"
                  cols="12"
                  style="overflow:visible"
                >
                  <CarouselAuto
                    :starting-image="0"
                    :images="eventImagesAll"
                    :auto-slide-interval="0"
                    :show-progress-bar="true"
                    :fullscreen="true"
                    :hide-grid="true"
                    :eager="true"
                  ></CarouselAuto>
                </v-col>
              </v-row>
          </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        scrollable
			  persistent
        color="black"
			  v-model="imageDialog"
				max-width="800">
        <v-card class="pa-3 pa-sm-5" style="width: min(100%, 800px)">
            <v-btn
              style="position: absolute; top: 0; right: 0;"
              icon
              class="white--text"
              dark
              @click="e=> {imageDialog = false}"
            >
                                  
              <v-icon color="black">mdi-window-close</v-icon>

            </v-btn>
          <v-card-text style="max-height: 100%;">
            <ImageUploader v-model="eventImages" :isAdmin="isAdmin" />
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
      scrollable
			persistent
			v-model="splitterDialog"
				max-width="800"
			>


        <v-card class="pa-3 pa-sm-5" style="width: min(100%, 800px)">
          <div class="pa-2 pa-sm-0">
          <v-card-title class="px-0 px-sm-0"> Group Splitter </v-card-title>
          <v-btn
              style="position: absolute; top: 0; right: 0;"
              icon
              color="black"
              class="white--text"
              dark
              @click="e=> {splitterDialog = false}"
            >
                                  
              <v-icon color="black">mdi-window-close</v-icon>

            </v-btn>
          <v-row style="max-height: 100px;" class="px-0 px-sm-0 d-flex justify-center align-center flex-wrap">
            <v-col>
              <v-text-field
              v-model="bucketSize"
              :rules="[numberRule]"
              type="number"
              placeholder="No. of groups..."/>
            </v-col>
            <!-- <v-col>
              <v-btn @click="splitter">Go</v-btn>
            </v-col> -->
            <v-col>
              <v-checkbox
              v-model="showDetails"
              :label="`Details?`">
              </v-checkbox>
            </v-col>
          </v-row>
          </div>
          <v-divider></v-divider>
          <v-card-text style="max-height: 100%;" class="pa-0">
          <v-row v-if="bucket" style="margin-left: 10px;
    width: calc(100% - 10px);">

            <v-col cols="6" :class="[!showDetails && intBucketSize>=2? ((intBucketSize>=3)?'col-sm-4 col-md-4': 'col-sm-6 col-md-6'): 'col-12']" v-for="(value, propertyName) in bucket" :key="propertyName">
                <v-divider> </v-divider>
                <br/>
                <v-row>
                  <v-col>
                    <b>{{"Group - " + (parseInt(propertyName) + 1)}}</b>
                  </v-col>
                </v-row>
                <div v-for="(val, index) in value" :key="index">
                  <v-row>
                    <v-col class="d-flex">
                      <div >{{index+1 + "."}}</div>
                      <div style="flex:1">
                        {{!val.profileShow || val.profileShow.realName ?  "&nbsp;"+ val.firstName+" "+val.lastName : (val.nickName?  "&nbsp;"+ val.nickName : "&nbsp;"+ val.firstName)}}
                      </div>
                    </v-col>
                    <v-col v-if="showDetails">{{ val.country }}</v-col>
                    <v-col v-if="showDetails && !isMobileScreen">{{ val.university }}</v-col>
                  </v-row>
                </div>
            </v-col>

          </v-row>
          </v-card-text>


        </v-card>
      </v-dialog>
      <AccountForm :newInfoDialog ="openDialog" :error="passError" :success="success" />

      <v-snackbar v-model="isRegistering" app>Registering</v-snackbar>
      <v-snackbar v-model="isUnRegistering" app>Unregistering</v-snackbar>
      <v-snackbar v-model="isRegistered" app>Event Registered</v-snackbar>
      <v-snackbar v-model="isUnRegistered" app>Event Unregistered</v-snackbar>
    </div>
    </client-only>
  </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader';
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { atcb_action } from 'add-to-calendar-button';
import Spinner from '@/components/LoadingSpinner';
import Carousel from '../../components/Carousel.vue';
import CarouselAuto from '../../components/CarouselAuto.vue';
import AccountForm from "../../components/FormAccount.vue";
export default {
  head() {
    return { title: (this.event && 'glober event | '+this.event.title) || 'glober event' }
  },
  components: { ImageUploader, Spinner, Carousel, CarouselAuto, AccountForm },
  data() {
    return {
      // eventImagesAll: [],
      eventImagesListener: function() {return},
      eventImages: null,
      imageDialog: false,
      fullImageDialog: false,
      splitterDialog: false,
      formAnswersMounted: false,
      numberRule: v  => {
        if (v && typeof v === 'string' && !v.trim()) return true;
        if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
        return 'Number has to be between 0 and 999';
      },
      intBucketSize: 0,
      showDetails: false,
      bucket: null,
      bucketSize: null,
      prevGoodValue: null,
      isMounted: false,
      confirmDialog: false,
      fileUploadedUrls: [],
      customFormData: {},
      customFormValues: {},
      imgFailed: false,
      openDialog: false,
      isRegistered: false,
      isRegistering: false,
      isUnRegistered: false,
      isUnRegistering: false,
      eventImagesArray: [],
      entryId: "",
      passError: "",
      error: "",
      success: "",
      userAlreadyRegistered: false,
      event: "",
      pageLoaded: false,
      eventTopImages : [],
      attendees: [],
      entries: [],
      customFormElementNameToObjDict: {}
    };
  },
  async created() {
    if (process.browser) {
      await this.getInfo()
      await this.isUserAlreadyRegistered()
      await this.getEventImages(this.$route.params.id)
      this.$nuxt.$on('closeDialog', ($event) => {
        this.openDialog = false
      })
      this.$nuxt.$on('success', ($event) => {
        this.success = $event
        setTimeout(()=>{
          this.success = null
        },3000)
        this.validateRegistration();
      })
      this.$nuxt.$on('error', ($event) => {
        this.error = $event
        setTimeout(()=>{
          this.error = null
        },3000)
      })
    }

  },
  methods: {
    closeFullImageDialog() {
      this.fullImageDialog = false;
      this.$forceUpdate()
    },
    async getOwnEventImages(eventId) {
      // console.log("selected thing",event)
      if (!eventId) {
        this.eventImages = null;
        return
      }
      if (!this.user || !this.user.uid) {
        console.log('here')
        return
      }
      let eventImages = await this.$fire.firestore.collection('eventImages')
      .where("userId","==",this.user.uid)
      .where("eventId","==",eventId)
      .get()
      .then((querySnapshot) => {
        let out = []
        querySnapshot.forEach((doc) => {
          let id = doc.id
          let data = doc.data()
          out.push({
            id,
            ...data
          })
        })
        return out
      })
      if (!eventImages[0]) {
        eventImages = {
          userId: this.user.uid,
          eventId,
          comment: "",
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          images: []
        }
        await this.$fire.firestore.collection('eventImages').add(eventImages)
        .then((docRef) => {
          eventImages = [{
            ...eventImages,
            id: docRef.id
          }]
        })
        .catch(err => {
          console.log(err)
        })
      }
      this.eventImages = {
        userId: this.user.uid,
        eventId,
        comment: "",
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        images: [],
        ...eventImages[0]
      }
      this.$forceUpdate()
    },
    onFormAnswersDestroyed() {
      this.formAnswersMounted = false
    },
    onFormAnswersMounted() {
      if (!this.formAnswersMounted) {
          this.$nextTick(() => {
            const components = this.$refs.customEventFormAnswers
            components.forEach(e => {
              const labels = e.$el.getElementsByClassName('formulate-input-label')
                labels.forEach(f => {
                  const innerHTML = f.innerHTML
                  const match = innerHTML.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                  let alteredHTML = innerHTML;
                  if (match) {
                    match.map(url=>{
                      alteredHTML=alteredHTML.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
                    })
                    f.innerHTML = alteredHTML
                  }
                })
              })
        })
        this.formAnswersMounted= true
        this.$forceUpdate()
      }
    },
    onFormCreated(val) {
      this.$nextTick(()=>{
          const labels = val.$el.getElementsByClassName('formulate-input-label')
          labels.forEach(e => {
            const innerHTML = e.innerHTML
            const match = innerHTML.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
            let alteredHTML = innerHTML;
            if (match) {
              match.map(url=>{
                alteredHTML=alteredHTML.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
              })

              e.innerHTML = alteredHTML
            }
          })
      })
    
    },
    splitter(val) {
      val = parseInt(val)
      const attendees = this.attendees
      const propComparator = (propName) =>
        (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1
      attendees.sort(propComparator('university'))
      attendees.sort(propComparator('country'))
      if ((!val || typeof val === 'string' && !val.trim()) || isNaN(parseInt(val)) || val <= 0 && val >= 999) {
        return
      }
      const bucket = {}
      attendees.forEach((e,i)=>{
        if (bucket.hasOwnProperty(i%val)) {
          bucket[i%val].push(e)
        } else {
          bucket[i%val] = [e]
        }
      })
      this.bucket = bucket
    },
    // propComparator(prop) {
    //     return function(a, b) {
    //         return a[prop] - b[prop];
    //     }
    // },
    ...mapMutations({
      setAccount: 'account/SET_ACCOUNT'
    }),
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    replaceUrls(string) {
      const urlRegex = /href="([^\'\"]+)/g
      return string? string.replace(urlRegex, (url) => {
        return (
          ' target="_blank" ' + url
        )
      }) : ''
    },
    addToCalendar() {
      if (process.browser) {
        if (!this.user) {
          this.error = "You must login first."
          setTimeout(()=>{
            this.error = null
          },3000)
          return
        }
        if (!this.userAlreadyRegistered) {
          this.error = "You must register the event first."
          setTimeout(()=>{
            this.error = null
          },3000)
          return
        }
        atcb_action({
        name: "Glober Event: " + this.event.title,
        description: `[p]Glober Event link:[/p] [url]https://globerjp.com/event/${this.$route.params.id}[/url]`,
        startDate: this.event.eventDateFrom,
        endDate: this.event.eventDateTo,
        startTime: this.event.eventTimeFrom,
        endTime: this.event.eventTimeTo,
        options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo'],
        timeZone: "Asia/Tokyo",
        iCalFileName: "Glober Event - " + this.event.title,
      });
      }
    },
    downloadMe(href) {
      // console.log(index)
      const link = document.createElement('a')
      link.href = href
      link.download = 'image_' + Date.now().toString()
      link.target = '_blank'
      link.click()
    },
    async customFormFileUploader(file, progress, error, options) {
      const storage = this.$fire.storage;
      const imageRef = storage.ref(`customFormFiles/${this.event.id}/${this.user.uid}/${file.name}`);
      const url = await imageRef
      .put(file, {contentType: file.type})
      .then(snapshot => {
        // eslint-disable-next-line promise/no-nesting
        return snapshot.ref.getDownloadURL().then(url => {
          return url;
        });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Error uploading image', err);
      });
      progress(100)
      this.fileUploadedUrls.push(url);
      return [{"url" : url}]
    },
    async deleteImage(url) {
      this.$fire.storage
        .refFromURL(url)
        .delete();
    },
    async customFormSubmitHandler(data) {
      if (process.browser) {
        let purgedData ={}
        for (const [key, value] of Object.entries(data)) {
          purgedData[key] = key.startsWith('file') ? {'url' : value[0][0].url} : value
        }
        this.customFormValues = purgedData;
        
        this.handleRegistration()
      }
      
    },
    async customFormFailedValidationHandler(data){
      if (process.browser) {
        Object.entries(this.customFormData).forEach(e=>{
          if (e[0].startsWith('file')) {
            e[1].files[0].removeFile()
          }
        })
        
        this.fileUploadedUrls.forEach(url => {
          this.deleteImage(url)
        })
        
        this.error = "Please fill out all the required form fields."
        setTimeout(()=>{
          this.error = null
        },4000)
      }
    },
    isHtml(str) {
      if (process.browser) {
        let doc = new DOMParser().parseFromString(str, "text/html");
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
      }
      return true
    },
    async getInfo() {
      if(!this.$route.params.id) {
        this.$nuxt.error({ statusCode: 404, message: 'Page not found' });
        return
      }
      let res = await this.$fire.firestore.collection('events')
      .doc(this.$route.params.id)
      .get()
      let pageLoaded = false
      let event = {
        id: "ID",
        title: "",
        description: "",
        location: "",
        isOnline: false,
        creatorId: "ID",
        eventDateFrom: "",
        eventDateTo: "",
        eventTimeFrom: "",
        eventTimeTo: "",
        deadlineDate: "",
        deadlineTime: "",
        hasDeadline: false,
        hasAttendeeLimit: false,
        attendeeLimit: 0,
        images: [],
        formSchema: [],
      }

      let alteredDescription = ""
      let eventTopImages = []
      if (res.exists) {
        let data = res.data();
        if (data.description) {
          let match = data.description.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
          alteredDescription=data.description;
          if (match) {
            match.map(url=>{
              alteredDescription=alteredDescription.replace(url,"<a style='color:blue !important' href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
            })
          }
        }

        
        event = {
          ...event,
          ...data,
          description: this.replaceUrls(data.description),
          id: res.id,
          alteredDescription
        }

        if (event.images) {
          event.images.forEach((eventImage) => {
            if (eventImage && eventImage.imageUrl) {
                eventTopImages.push(eventImage)
            }
            
            // Array.prototype.push.apply(out, eventImages.images);
          })
        }
        if (event.isPublished) {
          pageLoaded = true;
        }
      }
      else {
        this.$nuxt.error({ statusCode: 404, message: 'Page not found' });
        return
      }
      
      let entries = await this.$fire.firestore.collection('entries').where("eventId","==",this.$route.params.id)
      .get()
      .then((querySnapshot) => {
        let out = []
        let userIds = new Set()
        querySnapshot.forEach((doc) => {
          let id = doc.id
          let data = doc.data()
          if (!userIds.has(data.userId)) {
            out.push({
              id,
              ...data,
            })
          }
          userIds.add(data.userId)
        })
        return [...out]
      })
      const promises = []
      for (let entry of entries) {
        promises.push(this.$fire.firestore.collection('users').doc(entry.userId).get())
      }
      let attendees = await Promise.all(promises).then((querySnapshot) => {
        let out = []
        querySnapshot.forEach(res => {
          let id = res.id
          let data = res.data()
          if (res && id && data) {
            out.push({
              id,
              ...data
            })
          }
        })
        return out
      })
      
      if (this.user) {
        let myEntry = entries.find(e=>{
          return e.userId === this.user.uid
        })

        if (myEntry && myEntry.customFormValues) {
          this.customFormValues = myEntry.customFormValues
        }
        if (myEntry && myEntry.customFormValues) {
          this.customFormElementNameToObjDict = myEntry.customFormElementNameToObjDict
        }
      }
      
    
      this.event = event;
      this.pageLoaded = pageLoaded;
      this.eventTopImages = eventTopImages;
      this.attendees = attendees;
      this.entries = entries;
    },
    async getEventImages(eventId) {
      // console.log("selected thing",event)
      // let eventId = event.id
      let eventImages = null
      let eventImagesArray = []
      if (this.user && this.user.uid) {
        this.eventImagesListener = this.$fire.firestore.collection('eventImages')
        .where("eventId","==",eventId)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            let id = doc.id
            let data = doc.data()
            if(this.user && this.user.uid && data.userId == this.user.uid) {
              eventImages = {
                id,
                ...data
              }
            }
            else {
              eventImagesArray.push({
                id,
                ...data
              })
            }
          })
          if (eventImagesArray) {
            let out = []
            eventImagesArray.forEach((eventImages) => {
              if (eventImages.images) {
                eventImages.images.forEach((eventImage) => {
                  if (eventImage && eventImage.imageUrl) {
                    out.push(eventImage)
                  }
                })
              }
              
              // Array.prototype.push.apply(out, eventImages.images);
            })
            eventImagesArray = out
          }
          this.eventImagesArray = eventImagesArray
          this.eventImages = eventImages
        })
      } else {
        await this.$fire.firestore.collection('eventImages')
          .where("eventId","==",eventId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let id = doc.id
              let data = doc.data()
              if(this.user && this.user.uid && data.userId == this.user.uid) {
                eventImages = {
                  id,
                  ...data
                }
              }
              else {
                eventImagesArray.push({
                  id,
                  ...data
                })
              }
            })
            if (eventImagesArray) {
              let out = []
              eventImagesArray.forEach((eventImages) => {
                if (eventImages.images) {
                  eventImages.images.forEach((eventImage) => {
                    if (eventImage && eventImage.imageUrl) {
                      out.push(eventImage)
                    }
                  })
                }
                
                // Array.prototype.push.apply(out, eventImages.images);
              })
          eventImagesArray = out
        }
        this.eventImagesArray = eventImagesArray
        this.eventImages = eventImages
      })
      }
      
    },
    async isUserAlreadyRegistered() {
      this.entryId = ''
      for (let entry of this.entries) {
        if (this.user&& entry&&entry.userId == this.user.uid) {
          this.entryId = entry.id
        }
      }
      this.userAlreadyRegistered = !!this.entryId
    },
    async validateRegistration() {
      if (process.browser) {
        this.isRegistering = true;
        this.$forceUpdate()
        await this.getInfo()
        await this.isUserAlreadyRegistered()
        if (this.userAlreadyRegistered) {
          this.error = "Already Registered."
          this.isRegistering = false
          setTimeout(() => {
            this.error = null
          }, 3000)
          return
        }
        if (this.isPassedDeadline) {
          this.error = "Event Past Deadline."
          this.isRegistering = false
            setTimeout(() => {
              this.error = null
            }, 3000)
          return
        }
        if (this.isEventFull) {
          this.error = "Event is full."
          this.isRegistering = false
            setTimeout(() => {
              this.error = null
            }, 3000)
          return
        }
        if (this.event.formSchema.length > 1) {
          this.$refs['customEventForm'].$el.querySelector('button').click()
          
        } else {
          await this.handleRegistration()
        }
      }
     
    },
    async handleRegistration() {
      if (!this.isAccountComplete) {
        this.isRegistering = false;
        this.passError = "Please complete your profile first!"
          setTimeout(()=>{
            this.passError = null
          },4000)
        this.openDialog = true;
        return
      }
      if (this.userAlreadyRegistered) {
        return
      }
      this.isRegistering = true;
      this.$forceUpdate()
      if (!this.customFormValues) {
        await this.$fire.firestore.collection('entries').add({
          eventId: this.event.id,
          userId: this.user.uid
        })
        .then((docRef) => {
          this.entryId = docRef.id;
          
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      } else {
        this.event.formSchema.forEach(e=>{
          this.customFormElementNameToObjDict[e.name] = e
        })
        await this.$fire.firestore.collection('entries').add({
          customFormValues: this.customFormValues,
          eventId: this.event.id,
          userId: this.user.uid,
          customFormElementNameToObjDict: this.customFormElementNameToObjDict
        })
        .then((docRef) => {
          this.entryId = docRef.id;
          this.attendees.push({
              ...this.$store.state.account.ACCOUNT,
              id: this.user.uid
          })
          this.setAccount({updatedAt: Date.now().toString()})
          this.userAlreadyRegistered = true;
          this.isRegistered = true;
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      }
      setTimeout(()=>{this.isRegistering = false;},3000)
    },
    async handleUnRegistration() {
      // const confirmation = window.confirm('Are you sure?');

      // if (!confirmation) return;
      await this.getInfo()
      await this.isUserAlreadyRegistered()
      if (!this.userAlreadyRegistered) {
          this.error = "Already UnRegistered."
          setTimeout(() => {
            this.error = null
          }, 3000)
        return
      }
      this.isUnRegistering = true;
      await this.$fire.firestore.collection('entries').doc(this.entryId).delete()
      .then(async() => {
        let index = this.attendees.findIndex((attendant) => attendant.id == this.user.uid)
        this.attendees.splice(index,1)
        this.setAccount({updatedAt: Date.now().toString()})
        if (!this.isAdmin) {
          const chatRoomIds = await this.$fire.firestore
          .collection('chatRooms')
          .where('eventId', '==',this.event.id).get()
          .then((querySnapshot) => {
            let out = []
            querySnapshot.forEach((doc) => {
              out.push({
                id: doc.id,
              })
            })
            return out
          })
          const promises = []
          chatRoomIds.forEach(e => {
            promises.push(this.$fire.firestore.collection('chatRooms').doc(e.id).update({
              users: this.$fireModule.firestore.FieldValue.arrayRemove(this.user.uid)
            }))
          })
          await Promise.all(promises)
        }
        
        
        this.userAlreadyRegistered = false;
        this.isUnRegistered = true;
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
      setTimeout(()=>{this.isUnRegistering = false;},3000)
    },
    isPastEndDate(date) {
      const currDate = Date.now()
      // console.log(date + 43200*1000, currDate)
      if (currDate > date) {
        return true
      } else {
        return false
      }
    },
  },
  // async asyncData({store, $fire, $moment, route, error}) {
  //   if(!route.params.id) {
  //     error({ statusCode: 404, message: 'Page not found' });
  //     return
  //   }
  //   let res = await $fire.firestore.collection('events')
  //   .doc(route.params.id)
  //   .get()
  //   let pageLoaded = false
  //   let event = {
  //     id: "ID",
  //     title: "",
  //     description: "",
  //     location: "",
  //     isOnline: false,
  //     creatorId: "ID",
  //     eventDateFrom: "",
  //     eventDateTo: "",
  //     eventTimeFrom: "",
  //     eventTimeTo: "",
  //     deadlineDate: "",
  //     deadlineTime: "",
  //     hasDeadline: false,
  //     hasAttendeeLimit: false,
  //     attendeeLimit: 0,
  //     images: []
  //   }

  //   let alteredDescription = ""
  //   let eventTopImages = []
  //   if (res.exists) {
  //     let data = res.data();
  //     if (data.description) {
  //       let match = data.description.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
  //       alteredDescription=data.description;
  //       if (match) {
  //         match.map(url=>{
  //           alteredDescription=alteredDescription.replace(url,"<a style='color:blue !important' href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
  //         })
  //       }
  //     }
      
  //     event = {
  //       ...event,
  //       ...data,
  //       id: res.id,
  //       alteredDescription
  //     }

  //     if (event.images) {
  //       event.images.forEach((eventImage) => {
  //         if (eventImage && eventImage.teaserImageUrl) {
  //             eventTopImages.push(eventImage.teaserImageUrl)
  //         }
          
  //         // Array.prototype.push.apply(out, eventImages.images);
  //       })
  //     }
  //     if (event.isPublished) {
  //       pageLoaded = true;
  //     }
  //   }
  //   else {
  //     error({ statusCode: 404, message: 'Page not found' });
  //     return
  //   }
    
  //   let entries = await $fire.firestore.collection('entries').where("eventId","==",route.params.id)
  //   .get()
  //   .then((querySnapshot) => {
  //     let out = []
  //     querySnapshot.forEach((doc) => {
  //       let data = doc.data()
  //       out.push({
  //         id: doc.id,
  //         ...data,
  //       })
  //     })
  //     return out
  //   })
  //   let promises = []
  //   for (let entry of entries) {
  //     promises.push($fire.firestore.collection('users').doc(entry.userId).get())
  //   }
  //   let attendees = await Promise.all(promises).then((querySnapshot) => {
  //     let out = []
  //     querySnapshot.forEach(res => {
  //       let id = res.id
  //       let data = res.data()
  //       if (res && id && data) {
  //         out.push({
  //           id,
  //           ...data
  //         })
  //       }
  //     })
  //     return out
  //   })
  
  //   return {
  //     event,
  //     pageLoaded,
  //     eventTopImages,
  //     attendees,
  //     entries,
  //   }
    
  // },
  mounted() {
    this.isMounted = true
    this.$formulate.options.uploader = this.customFormFileUploader;
  },
  destroyed() {
    if (process.browser) {
      this.eventImagesListener()
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: "account/ISADMIN"
    }),
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    },
    eventImagesAll() {
      const eventImagesArray = [...this.eventImagesArray]
      if(this.eventImages && this.eventImages.images 
      && this.eventImages.images.length) {
        this.eventImages.images.forEach(eventImage => {
          if (eventImage.imageUrl) {
            eventImagesArray.push(eventImage)
          }
        })
      }
      return eventImagesArray
    },
    // eventImages() {
    //   if (!this.job.images) return;
    //   const images = this.job.images.filter(
    //     e => e.imageUrl && e.imageUrl !== ''
    //   );
    //   return images;
    // },
    isAccountComplete() {
      return this.account.firstName  && this.account.country && this.account.university && this.account.dateOfEntry && this.account.major && this.account.expectedGraduationYear && this.account.degree
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    startingTime() {
      if (!this.event.eventDateFrom || !this.event.eventTimeFrom) return ""
      return this.toWeekDate(this.event.eventDateFrom +"T"+this.event.eventTimeFrom)
    },
    endingTime() {
      if (!this.event.eventDateTo || !this.event.eventTimeTo) return ""
      return this.toWeekDate(this.event.eventDateTo +"T"+this.event.eventTimeTo); 
    },
    duration() {
      if (!this.startingTime || !this.endingTime) return ""
      const diffInMs = Math.abs(
        new Date(this.event.eventDateFrom +"T"+this.event.eventTimeFrom) -
          new Date(this.event.eventDateTo +"T"+this.event.eventTimeTo)
      );

      const minutesDuration = Math.floor(diffInMs / 1000 / 60);
      let days = 0;
      let hours = 0;
      let minutes = 0;
      days = Math.floor(minutesDuration / 1440);
      hours = Math.floor((minutesDuration - days*1440) / 60);
      minutes = minutesDuration % 60;
      
      if (!hours && !minutes && !days) {
          return ""
      }
      return (
          (days ? ( days == 1? `1 day `: `${days} days `) : "") +
          (hours ? ( hours == 1? `1 hour `: `${hours} hours `) : "") +
          (minutes ? ( minutes == 1? `1 minute`: `${minutes} minutes`) : "")
        );
    },
    deadlineString() {
      if (!this.event.deadlineDate || !this.event.deadlineTime) return ""
      return new Date(this.event.deadlineDate +"T"+this.event.deadlineTime).toLocaleString('en-CA', {year: 'numeric', month: 'numeric', day: 'numeric',hour: 'numeric', minute:'2-digit'})
    },
    deadline() {
      if (!this.event.deadlineDate || !this.event.deadlineTime) return ""
      return new Date(this.event.deadlineDate +"T"+this.event.deadlineTime)
    },
    isEventFull() {
      return this.event.hasAttendeeLimit && (this.event.attendeeLimit <= this.attendees.length)
    },
    isPassedDeadline() {
      if (!this.event.hasDeadline)
      {
        const date = Date.parse(this.event.eventDateTo + "T" + this.event.eventTimeTo)
        const isPassed = this.isPastEndDate(date)
        return isPassed
      }
      const diff = (new Date()).getTime() - this.deadline
      if (diff > 0) {
        return true
      } else {
        return false
      }
    },
    user() {
      // console.log(this.$store.state.authUser)
      return this.$store.state.authUser
    },
  },
  watch: {
    isMounted() {
      this.$nextTick(() => {
         this.$nuxt.setLayout('default')
      })
    },
    // eventImages: {
    //   handler(val) {

    //     // const eventImagesArray = [...this.eventImagesArray]
    //     // if(val && val.images 
    //     // && val.images.length) {
    //     //   val.images.forEach(eventImage => {
    //     //     if (eventImage.imageUrl) {
    //     //       eventImagesArray.push(eventImage)
    //     //     }
    //     //   })
    //     // }
    //     // debugger
    //     // this.eventImagesAll = eventImagesArray

    //     // let eventImages = val || []
    //     // if (eventImages) {
    //     //   let out = []
    //     //   if (eventImages.images) {
    //     //         eventImages.images.forEach((eventImage) => {
    //     //           if (eventImage && eventImage.imageUrl) {
    //     //             out.push(eventImage)
    //     //           }
    //     //         })
    //     //       }
    //     //   eventImages = out
    //     // }
    //     // const allImagesUrl = new Set(this.eventImagesArray.map(e => e.imageUrl))
    //     // eventImages.forEach(eventImage => {
    //     //   if (!allImagesUrl.has(eventImage.imageUrl)) {
    //     //     this.eventImagesArray.push(eventImage)
    //     //   }
    //     // })
      
    //   },
    //   deep: true
    // },
    bucketSize: {
      handler(val, oldVal) {
          if (((!val || typeof val === 'string' && !val.trim()) || isNaN(parseInt(val)) || val <= 0 && val >= 999)) {
            val = oldVal
            
          }
          if((!val || typeof val === 'string' && !val.trim()) || isNaN(parseInt(val)) || val <= 0 && val >= 999) {
            this.intBucketSize = this.prevGoodValue
          } else {
            this.intBucketSize = parseInt(val)
            this.prevGoodValue = val
          }
          if (val) {
            this.splitter(val)
          }
          
      },
    },
    async $route(to, from) {
      if (to.name === 'event-id') {
        this.getEventImages(this.$route.params.id)
        let account = this.$store.state.account['ACCOUNT']
        if (this.user && this.attendees) {
          let newAttendees = this.attendees.map(e => {
            return e.id === this.user.uid ? {id: this.user.uid, ...account} : e
          })
          this.attendees = newAttendees
        }
        
      }
      if (from.name === 'event-id') {
        this.eventImagesListener()
      }
      //  this.$forceUpdate()
    },
    isRegistered() {
      if (this.isRegistered) {
        setTimeout(() => {this.isRegistered = false; this.isRegistering=false}, 3000);
      }
    },
    isUnRegistered() {
      if (this.isUnRegistered) {
        setTimeout(() => {this.isUnRegistered = false;this.isUnRegistering=false}, 3000);
      }
    },
  },
};
</script>
<style lang="scss">
.event-container {
    h1 {
  margin-bottom: 16px;
}

h2 {
  margin-bottom: 16px;
}

h3 {
  margin-bottom: 16px;
}
}

</style>
<style>

@import 'add-to-calendar-button/assets/css/atcb.min';
blockquote {
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
  padding-left: 1em;
  margin: 20px 0!important;
}
</style>
<style lang="scss">
@import '@/assets/variables.scss';
@import '@/assets/scss/main.scss';

.formulate-form {
  .formulate-input {
    width: 100% !important;
    .formulate-input-wrapper {
      .formulate-input-label {
        display: inline;
        max-width: calc(100% - 15px) !important;
      }
      .formulate-input-element {
        max-width: 100%;
      }
    }
    & [data-type="submit"] {
      display: none;
    }
  }
}
.formulate-input {
    width: 100% !important;
    .formulate-input-wrapper {
      .formulate-input-label {
        display: inline;
        max-width: calc(100% - 15px) !important;
      }
      .formulate-input-element {
        max-width: 100%;
      }
    }
    & [data-type="submit"] {
      display: none;
    }
  }


// .formulate-input {
//   & [data-classification="group"] {
//     .formulate-input-label {
//       margin-bottom: 20px !important;
//       // style all text-like inputs here
//     }
//   }
// }
.formulate-input-label .formulate-input-label--before {
  margin-bottom: 30px !important;
}
.content {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
    th {
      font-weight: 700;
      text-align: left;
      min-width: 1em;
      border: 2px solid grey;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
    }
    td {
      min-width: 1em;
      border: 2px solid grey;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
    }
  } 
  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 350px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  
}

</style>
<style lang="scss" scoped>
.tag {
  text-align: center;
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  p {
    margin-bottom: 0;
  }
}
#tags {
  display: flex;
  justify-content: flex-start;
}
</style>

<style lang="scss" scoped>
.top-carousel-div {
  @media screen and (max-width: 801px) {
    width: 800px;
  }
}
.carousel-div {
  // width: 800px;
  @media screen and (max-width: 801px) {
    width: 800px !important;
  }
}
</style>
