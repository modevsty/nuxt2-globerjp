<template>
  <div style="position: relative">
    <div class="spinner-container">
        <GloberSpinner  class="top-spinner" v-if="!isMounted && !pageLoaded"></GloberSpinner>
    </div>
    <client-only>
      <Banner />
      <v-carousel
        v-model="currentIndex"
        v-if="pageLoaded"
        :height="carouselHeight"
        :prev-icon="false"
        :next-icon="false"
        :interval="20000"
        cycle
        hide-delimiter-background
        show-arrows-on-hover
        class="mt-0 mb-9 carousel"
      >
        <v-carousel-item
          v-for="(item, index) in items"
          :key="item.id"
          :eager="(currentIndex === index || index == (currentIndex + 1))?true: false"
          :href="`/event/${item.id}`"
          class="carousel-item"
        >
          <div class="img-overlay"></div>
          <v-img
            transition="xxx"
            :lazy-src="isMobileScreen?lazyGif: lazyGifBig"
            @load="handleLoad()"
            :src="imgFailed? '/img/image-not-found.png' :getItem(item)"
            
            @error="imgFailed=true"
            :eager="(currentIndex === index || index == (currentIndex + 1))?true: false"
            
            class="carousel-img"
            id="carousel-img"
          >
            <v-container class="fill-height pa-0 ma-0 pb-0 carousel-inner" fluid>
              <v-row class="fill-height pb-0 mb-0 carousel-row" align="center">
                <v-col  class="carousel-col" cols="12">
                  <div v-show="imageLoaded" class="pa-0 carousel-div">
                    <div class="carousel-top">
                      <h2 v-text="item.title" style="color: rgb(24,118,210);white-space: pre-line" />
                    </div>
                    <div class="carousel-bottom">
                      <h3
                        v-text="`${extractDescription(item.description, 100)}`"
                        style="white-space: pre-line"
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-img>
        </v-carousel-item>
      </v-carousel>
      <v-container v-if="pageLoaded">
        <v-card-text
          class="pt-10 pb-10 px-6"
          style="font-size: 22px; font-weight: bold; text-align:center; min-height: 115px"
        >
          {{pageLoaded? "Explore": ""}}
        </v-card-text>
        <v-container class="event-container">
          <v-row
            align="center"
            class="justify-center justify-md-start event-container-row"
          >
            <v-col
              v-for="event in events"
              :key="event.id"
              :event="event"
              @register="handleRegistration"
              class="xs event-container-col"
              cols="12"
              xl="3"
              lg="4"
              md="6"
              sm="9"
            >
              <v-card
                :ripple="!isMobileScreen? true : false"
                :to="`/event/${event.id}`"
                nuxt
                class="pa-0 pb-3 event-card"
                hover
              >
                <div v-if="hasAndPassedDeadline(event)" class="deadline-passed-banner">
                  <span>
                    Past Deadline
                  </span>
                </div>
                <div v-else-if="event.hasLimitAndEventFull" class="deadline-passed-banner">
                  <span>
                    Event Full
                  </span>
                </div>
                <div v-if="!!event.images && event.images.length && event.images[0].teaserImageUrl" class="pt-0 event-card-inner">
                  <v-img
                    transition="xxx"
                    contain
                    :lazy-src="lazyGif"
                    :src="imgFailed? '/img/image-not-found.png' :event.images[0].teaserImageUrl"
                    alt="event Post Image"
                    class="event-card-img"
                    @error="imgFailed=true"
                  />
                </div>
                <div v-else class="pt-0 event-card-inner">
                  <v-img
                    class="event-card-img"
                    alt="Image Not Found Image"
                    src="/img/image-not-found.png"
                  />
                </div>
                <v-card-text
                  v-if="event.title && event.title !== ''"
                  class="font-weight-bold jgreyest--text card-title"
                >
                  {{ event.title }}
                </v-card-text>
                <v-card-text
                  v-if="
                      event.location !== '' && !event.isOnline
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px; font-weight: bold;"
                >
                  <v-icon color="jblackest" size="18">mdi-map-marker</v-icon>
                  <!-- <span class="font-weight-bold">
                    Location:
                  </span> -->
                  <span
                    class="mt-1"
                  >
                    {{
                      event.location
                    }}
                  </span>

                </v-card-text>
                <v-card-text
                  v-if="
                      event.Location !== '' && event.isOnline
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px; font-weight: bold;"
                >
                  <!-- <v-icon color="jblackest" size="18">mdi-map-marker</v-icon> -->
                  <!-- <span class="font-weight-bold">
                    Location:
                  </span> -->
                  <span
                    v-if="
                      event.isOnline
                    "
                    class="mt-1"
                  >
                    Online
                  </span>

                </v-card-text>
                <v-card-text
                  v-if="event.description"
                  class="pt-2 pb-1 px-6 jgreyer--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    {{ extractDescription(event.description,75)}}
                  </span>
                </v-card-text>
                <v-card-text
                  v-if="event.eventDateFrom"
                  class="pt-2 pb-1 px-6 blue--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    {{
                      toWeekDay(event.eventDateFrom+'T'+event.eventTimeFrom)
                    }}
                  </span>
                  <br />
                  <p style="font-weight: 700; min-height: 1.4em; margin:0">
                    {{
                      toDuration(event.eventDateFrom+'T'+event.eventTimeFrom)? "(" + toDuration(event.eventDateFrom+'T'+event.eventTimeFrom) + ")" : ""
                    }}
                  </p>
                </v-card-text>
                <v-card-text class="tag-container">
                  <v-chip class="blue white--text tag" v-for="tag of event.tags" :key="tag"
                    ><p>{{ tag }}</p></v-chip
                  >
                </v-card-text>
                <!-- <v-card-text
                    class="text-center pa-4 card-details"
                  >
                    See Details
                  </v-card-text> -->
              </v-card>
            </v-col>
            <v-col
              v-for="event in remainingEvents"
              :key="event.id"
              :event="event"
              @register="handleRegistration"
              class="xs event-container-col"
              cols="12"
              xl="3"
              lg="4"
              md="6"
              sm="9"
            >
              <v-card
                disabled
                :to="`/event/${event.id}`"
                style="pointer-events: auto;"
                nuxt
                class="pa-0 pb-3 event-card"
                hover
              >
                <div class="closed-banner">
                  <span>
                    Closed
                  </span>
                </div>
                <div v-if="!!event.images && event.images.length && event.images[0].teaserImageUrl" class="pt-0 event-card-inner">
                  <v-img
                    transition="xxx"
                    contain
                    :lazy-src="lazyGif"
                    :src="imgFailed? '/img/image-not-found.png' :event.images[0].teaserImageUrl"
                    
                    alt="event Post Image"
                    class="event-card-img"
                    @error="imgFailed=true"
                  />
                </div>
                <div v-else class="pt-0 event-card-inner">
                  <v-img
                    class="event-card-img"
                    alt="Image Not Found Image"
                    src="/img/image-not-found.png"
                  />
                </div>
                <v-card-text
                  v-if="event.title && event.title !== ''"
                  class="font-weight-bold jgreyest--text card-title"
                >
                  {{ event.title }}
                </v-card-text>
                <v-card-text
                  v-if="
                      event.location !== '' && !event.isOnline
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px; font-weight: bold;"
                >
                  <v-icon color="jblackest" size="18">mdi-map-marker</v-icon>
                  <!-- <span class="font-weight-bold">
                    Location:
                  </span> -->
                  <span
                    class="mt-1"
                  >
                    {{
                      event.location
                    }}
                  </span>

                </v-card-text>
                <v-card-text
                  v-if="
                      event.Location !== '' && event.isOnline
                  "
                  class="pt-2 pb-1 px-6 jblackest--text"
                  style="font-size: 16px; font-weight: bold;"
                >
                  <!-- <v-icon color="jblackest" size="18">mdi-map-marker</v-icon> -->
                  <!-- <span class="font-weight-bold">
                    Location:
                  </span> -->
                  <span
                    v-if="
                      event.isOnline
                    "
                    class="mt-1"
                  >
                    Online
                  </span>

                </v-card-text>
                <v-card-text
                  v-if="event.description"
                  class="pt-2 pb-1 px-6 jgreyer--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    {{ extractDescription(event.description,75) }}
                  </span>
                </v-card-text>
                <v-card-text
                  v-if="event.eventDateFrom"
                  class="pt-2 pb-1 px-6 blue--text"
                  style="font-size: 16px; font-weight: bold"
                >
                  <span class="mt-1">
                    {{
                      event.eventDateFrom
                        .split("-")
                        .join(".")
                    }}
                  </span>
                </v-card-text>
                <v-card-text class="tag-container">
                  <v-chip class="blue white--text tag" v-for="tag of event.tags" :key="tag"
                    ><p>{{ tag }}</p></v-chip
                  >
                </v-card-text>
                <!-- <v-card-text
                    class="text-center pa-4 card-details"
                  >
                    See Details
                  </v-card-text> -->
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <Spinner v-if="isLoading && !eof" style="min-height: 90px;" />
       <v-card-title v-if="eof" style="min-height:90px; justify-content:center;">No more events.</v-card-title>
      </v-container>
    </client-only>
  </div>
</template>

<script>
import moment from 'moment'
import fixtures from "@/fixtures/fixtures.json"
import Banner from '@/components/Banner.vue'
import Spinner from '@/components/LoadingSpinner'
import GloberSpinner from '@/components/GloberSpinner'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import { stripHtml } from "string-strip-html";
export default {
  components: {Spinner, Banner, GloberSpinner},
  layout() {
    return process.browser? 'default':'loginLayout'
  },
  data() {
    return {
      universityAlterNames: fixtures.universityAlterNames,
      isMounted: false,
      currentIndex: 0,
      lazyGifBig: 'data:image/gif;base64,R0lGODlhCASwAfYOAPDw8PLy8u3t7fX19efn597e3tHW1sfNzcLKyrW+vqq2tpWxsYarq2Krq/b29vT09O7u7vHx8erq6tnc3MjMzLq/v6i2tpenp4OgoHGcnOnp6evs7ODh4dja2s7R0b3Fxay3t5Krq3Grq/Pz8/b39+Hi4tjZ2cnNzbvCwrK9vZ+5uYavr2WwsPL19fHz8+zt7ejp6ZeamoyOjoOEhHN8fGR7e/L39/Hy8u7v793i4sLi4tna2vDx8ePj45OVlZ6fn7Cxsb2+vszNze3v7/T395aXl5+goK+wsLy9vdDR0dvb2+Pk5O7w8PP39+/v7/T19ejo6OHh4cXPz7fExK2+vpi7u4e4uFrAwPf39+zs7Obm5tzh4dLb28XW1q3T053R0XLW1lXa2vDy8ubs7Njq6s3q6qjj43zj4+bo6ODk5M7e3r/a2qLV1YPQ0PX29trc3M7S0sHJya27u6Ozs42wsHuurmWurgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/ilPcHRpbWl6ZWQgd2l0aCBodHRwczovL2V6Z2lmLmNvbS9vcHRpbWl6ZQAh+QQFCgAOACwAAAAACASwAQAE/9DJSau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIP9DihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDix9Pvrz58+jTq1/Pvr379/Djy59Pv779+/jz69/Pv7///wAGKOD/gAQWaOCBCCao4IIMNujggxBGKOGEFFZo4YUYZqjhhhx26OGHIIYo4ogklmjiiSimqOKKLLbo4oswxijjjDTWaOONOOao44489ujjj0AGKeSQRBZp5JFIJqnkkkw26eSTUEYp5ZRUVmnllVhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirpgwM00IAAky5GwAAUFGBpARVwmqlgBzCwQKefUjCAAKKO+pcBphowgacNgCrBqqy6GtgCpopKq60O4KprYAWYmoAEv97KaqvD+qVA/68OJBtsrs3mVQCwt5p6arK4MjtttXEBoMC4mE6QQKwDXNsts+uC+9YACYw7rqjwYqssve26C1cB8ipQgLcYrAuwvmylKy8CHORL8FzwKlCuBt0ufBcAHgwscVqrZqzxBxpvfLFZ14YcMsUddMvqyR+DLPLIFZ/s8sMpi9WxxwnPvGrMBVeMs1zCbtDzzgUHgLLPLgONscA1v2x0WUgra0HPJlu89FZFT2CzwtNSOzVYGauKcsQ0O731WWAPPfTYa3ms9tlooyX0wzS/3fbRWsfN9txj/Zw1u1rjrVbYfsN1d+CEF2744YgnrvjijDfu+OOQRy755JRXbvnlmGeu+f/mnHfu+eeghy766KSXbvrpqKeu+uqst+7667DHLvvstNdu++2456777rz37vvvwAcv/PDEF2/88cgnr/zyzDfv/PPQRy/99NRXb/312Gev/fbcd+/99+CHL/745Jdv/vnop6/++uy37/778Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHQAyiEIdIxCIa8YhITKISl8jEJjrxiVCMohSnSMUqWvGKWMyiFrfIxS44evGLYAyjGMdIxjKa8YxoTKMa18jGNrrxjXCMoxznSMc62vGOeMyj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',
      lazyGif: 'data:image/gif;base64,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',
      relevantEventsQuery: null,
      isRelevantEventsEmpty: false,
      querySnapShot: null,
      pageLoaded: false,
      events: [],
      eof: false,
      isLoading: false,
      lastDoc: null,
      batchSize: 6,
      rowSize: 6,
      latestPublishedAt: null,
      remainingEvents: [],
      imgFailed: false,
      imageCount: 0,
      imageLoaded: false,
      allowed: 0,
      accountLastUpdatedAt: ''
    };
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    },
    carouselHeight() {
      return "";
    },

    items() {
      let random;
      const events = this.events
      .filter(e=>{
        return !this.hasAndPassedDeadline(e) && !e.hasLimitAndEventFull
      })
      
      const len = events.length;
      if (len >= 6) {
        let selected = [];
        const shuffledArray = [...events]
        this.shuffleArray(shuffledArray)
        shuffledArray.slice(0, 6).forEach((e) => {
          if (e.images && e.images.length && e.images[0].imageUrl) {
            selected.push(e);
          }
        });
  
        return selected;
      } else if (events.length > 0 && events.length < 6) {
        let selected = [];
        const shuffledArray = [...events]
        this.shuffleArray(shuffledArray)
        shuffledArray.forEach((e) => {
          if (e.images && e.images.length && e.images[0].imageUrl) {
            selected.push(e);
          }
        });

        return selected;
      } else {
        return null;
      }
    },
    user() {
      return this.$store.state.authUser
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    ...mapGetters({
      isAdmin: "account/ISADMIN",
    }),
  },
  async mounted() {
    this.isMounted = true
    if (this.$nuxt.$data.layoutName === 'default') {

      // const didUpdate = await this.checkLatestPublishedAtAndLoad();
      await this.checkLatestPublishedAtAndLoad();
      window.addEventListener('scroll', this.loadMoreEvents)
    }

    // if (!didUpdate) {
    //   this.updateData()
    // }
  },
  destroyed () {
    if (process.browser){
      window.removeEventListener('scroll', this.loadMoreEvents)
    }
  },
  async created() {
    
    // if(process.browser) {
    //   this.getData()
    // }
    // if(process.browser) {
    //   const date = Date.now().toString()
    //   let events = await this.$fire.firestore.collection('events')
    //   .where("isPublished","==",true)
    //   .orderBy('eventDateFrom', 'asc')
    //   .get()
    //   .then((querySnapshot) => {
    //     let out = []
    //     querySnapshot.forEach((doc) => {
    //           out.push({
    //             id: doc.id,
    //             publishedAt: "",
    //             createdAt: "",
    //             updatedAt: "",
    //             ...doc.data(),
    //           })
    //       });
    //     return out
    //   });
    //   // console.log(events)
    //   let filteredEvents = events.filter(e => {
    //     const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
    //     const currDate = Date.now()
    //     // console.log(date + 43200*1000, currDate)
    //     if (currDate > date + 5000) {
    //       return false
    //     } else {
    //       return true
    //     }
    //   })
    //   let remainingEvents = events.filter(e => {
    //     const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
    //     const currDate = Date.now()
    //     // console.log(date + 43200*1000, currDate)
    //     if (currDate > date + 5000) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }).reverse()
      
    //   let querySnapShot = this.$fire.firestore.collection('events')
    //       .orderBy('publishedAt', 'desc')
    //       .limit(1).get()
    //   let latestPublishedAt = "";
    //   if (querySnapShot.size > 0) {
    //     let latestPublishedData = querySnapShot.docs[0].data()
    //     latestPublishedAt = latestPublishedData.publishedAt
    //   }
    //   this.events = filteredEvents
    //   this.latestPublishedAT = latestPublishedAt
    //   this.remainingEvents = remainingEvents
    //   this.pageLoaded = true
    // }
  },
  watch: {
    isMounted() {
      this.$nextTick(() => {
         this.$nuxt.setLayout('default')
      })
    },
    async $route(to, from, savedPosition) {
      if (to.name === 'index') {
        // if (this.accountLastUpdatedAt !== (this.account? this.account.updatedAt : '')) {
        //   location.reload()
        //   return
        // }
        await this.checkLatestPublishedAtAndLoad();
        window.addEventListener('scroll', this.loadMoreEvents)
      }
      if (from.name === 'index') {
        window.removeEventListener('scroll', this.loadMoreEvents)
      }

    },
  },
  methods: {
    extractDescription(str, num) {
      let trimmed = ''
      const extracted = this.extractContent(str, true)
      let curr = 0
      let len = extracted.length
      while (num > 0 && curr < len) {

        const isAlphaNum = this.charIsAlphanum(extracted[curr])
        num = isAlphaNum? num - 1: num - 3.5;
        // const extractSize = isAlphaNum? num-5:num/2;
        if (num < 10 && (extracted[curr] === ' ' || extracted[curr] === '、')) {
          break
        }
        trimmed += extracted[curr++]
        // const index = isAlphaNum? Math.min(this.findNextSpace(extracted,extractSize, extractSize), num+5): 0
        // const trimmed = isAlphaNum? `${extracted.substr(0, index)}...`: `${extracted.substr(0, num/2)}...`
      }
      
      return trimmed + '...'
    },
    findNextSpace(str, pos) {
      return str.indexOf(' ', pos);
    },
    charIsAlphanum(char) {
      if (typeof char !== 'string') {
        return false;
      }

      return /^[a-zA-Z0-9\t\n ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]+$/.test(char);
    },
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    hasAndPassedDeadline(event) {
      if (!event.hasDeadline) return false
      const diff = (new Date()).getTime() - this.deadline(event)
      if (diff > 0) {
        return true
      } else {
        return false
      }
    },
    deadline(event) {
      if (!event.deadlineDate || !event.deadlineTime) return ""
      return new Date(event.deadlineDate +"T"+event.deadlineTime)
    },
    loadMoreEvents () {
      if (process.browser){
        const elementBounds = this.$el.getBoundingClientRect()

        // Add extra padding to load earlier even before the bottom of the element is in view.
        const padding = 200

        const bottomOfWindow =
          elementBounds.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) + padding

        if (bottomOfWindow && !this.isLoading && !this.eof) {
          this.getData()
        }
      }
    },
    async checkLatestPublishedAtAndLoad() {
      const db = this.$fire.firestore
      let query = db.collection('events')
        .orderBy('publishedAt', 'desc')
        .limit(1)
      const querySnapShot = await query.get()
      if (querySnapShot.size > 0) {
        const data = querySnapShot.docs[0].data()
        if (data.publishedAt == this.latestPublishedAt &&
        (this.accountLastUpdatedAt == (this.account? this.account.updatedAt : ''))
        ) {
          return false
        }
        this.isRelevantEventsEmpty = false
        this.latestPublishedAt = data.publishedAt
        this.accountLastUpdatedAt = this.account? this.account.updatedAt : ''
        this.events = []
        this.remainingEvents = []
        this.lastDoc = null
        this.eof = false
        await this.getData();
        return true
      }
    },
    updateData() {
      let events = this.remainingEvents.reverse().concat(this.events)
      let filteredEvents = events.filter(e => {
      const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
      const currDate = Date.now()
      // console.log(date + 43200*1000, currDate)
      if (currDate > date + 5000) {
          return false
        } else {
          return true
        }
      })
      let remainingEvents = events.filter(e => {
        const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
        const currDate = Date.now()
        // console.log(date + 43200*1000, currDate)
        if (currDate > date + 5000) {
          return true
        } else {
          return false
        }
      }).reverse()

      this.events = filteredEvents
      this.remainingEvents = remainingEvents
    },
    async getData() {
      // console.log(this.missed, this.events.length, this.events, this.remainingEvents.length, this.remainingEvents)
      // debugger
      if (this.isLoading || this.eof) {
        return
      }

      if (!this.events.length && !this.remainingEvents.length) {
        this.pageLoaded = false
      } else {
        this.isLoading = true
      }
      

      
      const date = new moment(Date.now()).format('YYYY-MM-DD')
      // const time = new moment(Date.now()).format('HH:mm')
      // console.log(date, time)

      this.batchSize = this.rowSize - (this.events.length + this.remainingEvents.length) % this.rowSize
      if(!this.remainingEvents.length && !this.isRelevantEventsEmpty) {
        this.relevantEventsQuery = this.$fire.firestore.collection('events')
        .where("eventDateTo",">=",date)
        .where("isPublished","==",true)
        .orderBy('eventDateTo', 'asc')
        .orderBy('eventTimeTo', 'asc')
        .limit(parseInt(this.batchSize* 2))

        if (this.lastDoc) {
          this.relevantEventsQuery = this.relevantEventsQuery.startAfter(this.lastDoc)
        }

        this.querySnapshot = await this.relevantEventsQuery.get()
        this.isRelevantEventsEmpty = this.querySnapshot.empty
      }
      

      if (this.isRelevantEventsEmpty) {
        this.relevantEventsQuery = this.$fire.firestore.collection('events')
          .where("eventDateTo","<",date)
          .where("isPublished","==",true)
          .orderBy('eventDateTo', 'desc')
          .orderBy('eventTimeTo', 'desc')
          .limit(this.batchSize)

        if (this.lastDoc) {
          this.relevantEventsQuery = this.relevantEventsQuery.startAfter(this.lastDoc)
        }
        this.querySnapshot = await this.relevantEventsQuery.get()
      }
      

      this.eof = this.querySnapshot.empty

      if (this.querySnapshot.size > 0) {
        this.lastDoc = this.querySnapshot.docs[this.querySnapshot.docs.length - 1]
        
        for (const doc of this.querySnapshot.docs) {
          let id = doc.id;
          let data = doc.data()
          let allow = false
          if (data.hasOwnProperty('hasUniversityCondition') && data.hasUniversityCondition) {
            const universitySet = new Set(data.universityCondition.map(e => e.toLowerCase()))
            for (const [key, value] of Object.entries(this.universityAlterNames)) {
              if (universitySet.has(key)) {
                value.forEach(item => universitySet.add(item.toLowerCase()))
              }
            }

            if (this.user && this.account) {
              if (universitySet.has(this.account.university.toLowerCase().trim())) {
                allow = true
              } 
              else if (this.isAdmin || this.user.uid === data.creatorId) {
                allow = true
              }
            }
 
          } else {
            allow = true
          }
          if (allow) {
            if (this.isRelevantEventsEmpty) {
              this.remainingEvents.push({
                id,
                publishedAt: "",
                createdAt: "",
                updatedAt: "",
                ...data,
              })
            } else {
              if (data.hasAttendeeLimit) {
                const snapShot = 
                  await this.$fire.firestore.collection('entries')
                  .where("eventId","==",id)
                  .get()

                const hasLimitAndEventFull = (snapShot.size >= data.attendeeLimit)
                this.events.push({
                  id,
                  publishedAt: "",
                  createdAt: "",
                  updatedAt: "",
                  ...data,
                  hasLimitAndEventFull
                })
              } else {
                this.events.push({
                  id,
                  publishedAt: "",
                  createdAt: "",
                  updatedAt: "",
                  ...data,
                })
              }
            }
            this.allowed += 1
          }
        }
      }
      // const pastDeadlineEvents = this.events.filter(e => this.hasAndPassedDeadline(e))
      // const notPastDeadlineEvents = this.events.filter(e => this.hasAndPassedDeadline(e))

      if (!this.allowed  && !this.eof) {
        await this.getData()
      }
      this.allowed = 0
      this.pageLoaded = true
      this.isLoading = false
      
      
      // let events = await this.$fire.firestore.collection('events')
      // .where("isPublished","==",true)
      // .orderBy('eventDateFrom', 'asc')
      // .get()
      // .then((querySnapshot) => {
      //   let out = []
      //   querySnapshot.forEach((doc) => {
      //         out.push({
      //           id: doc.id,
      //           publishedAt: "",
      //           createdAt: "",
      //           updatedAt: "",
      //           ...doc.data(),
      //         })
      //     });
      //   return out
      // });

      // let filteredEvents = events.filter(e => {
      //   const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
      //   const currDate = Date.now()
      //   // console.log(date + 43200*1000, currDate)
      //   if (currDate > date + 5000) {
      //     return false
      //   } else {
      //     return true
      //   }
      // })
      // let remainingEvents = events.filter(e => {
      //   const date = Date.parse(e.eventDateTo + "T" + e.eventTimeTo)
      //   const currDate = Date.now()
      //   if (currDate > date + 5000) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }).reverse()
      // this.events = filteredEvents
      // this.remainingEvents = remainingEvents
    },
    extractContent(s, space) {
      return stripHtml(s).result;
    },
    toDuration(value) {
      if(!value || !process.browser) {
        return ''
      }
      const now = moment(new Date()).startOf('day'); //todays date
      const end = moment(value).startOf('day'); // another date
      const duration = moment.duration(end.diff(now));
      let days = Math.floor(duration.asDays());
      if (days < 0) {
        return ''
      } else if (days == 0) {
        return 'Today!!'
      } else if (days == 1) {
        return 'Tomorrow!'
      }
      let months = Math.floor(days/30)
      days = days % 30;
      return (months? (months == 1? `1 month `: `${months} months `): "")
          + (days? (days == 1? `1 day `: `${days} days `): "") + "to go!"
    },
    toWeekDay(value) {
      if(!value) {
        return ''
      }
      const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const date = new Date(value)
      const day = date.getDay()
      const localDate = date.toLocaleString('en-CA', {year: 'numeric', month: 'numeric', day: 'numeric'}).split("-").join(".");
      const localTime = date.toLocaleString('en-CA', {hour: 'numeric', minute:'2-digit'})
      return localDate + ", " + weekday[day] + ", " + localTime; ;
    },
    // toFinalWeekDay(value) {
    //   return new Date(value).getDay()
    // },
    getItem(item) {
      let res = ""
      if (process.browser){
        if (window.innerWidth < 800) {
          if (item.images && item.images.length && item.images[0].teaserImageUrl) {
            res = item.images[0].teaserImageUrl
          } 
        } else {
          if (item.images && item.images.length && item.images[0].imageUrl) {
            res = item.images[0].imageUrl
          }
        }
      }
      return res
      // return item.images[0].imageUrl
    },
    signup() {
      if (this.$store.getters["isLoggedIn"]) {
        this.$router.push("/dashboard")
      } else {
        this.$router.push({path: '/signup'});
      }
    },
    handleLoad() {
      this.imageCount += 1;
      if (this.imageCount >= 1) {
        this.imageLoaded = true;
      }
    },
    rng(min, max) {
      return Math.random() * (max - min) + min;
    },
    async handleRegistration(eventId) {
      // this.isRegistering = true;
      // console.log(eventId);
      // await this.$axios.$post(
      //   "https://t2meet.bubbleapps.io/version-test/api/1.1/wf/register-event",
      //   {},
      //   {
      //     params: {
      //       eventId: eventId,
      //       userId: this.currentUser.user_id,
      //     },
      //   }
      // );
      // this.$fetch();
    }
  }
}
</script>
<style lang="scss" scoped>
.spinner-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  height: 100svh;

  .top-spinner {
    margin-top: -45px !important; 
    height: fit-content;
    width: fit-content;
  }
}
.tag {
  text-align: center;
  margin-right: 1rem;
  margin-top: 0.5rem;
  p {
    margin-bottom: 0;
  }
}
/* .cards {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  flex-wrap: wrap;
  align-content: space-between;
}
.cards * {
  text-decoration: none;
  margin-top: 10px;
} */
</style>

<style lang="scss" scoped>
@import "~/assets/scss/global.scss";
.index-container {
  margin-bottom: 40px;
}
.deadline-passed-banner {
  position: absolute;
  top: 15px;
  z-index: 1;
  opacity: 0.97 !important;

  display: inline;
  span {
    border-radius: 0 5px 5px 0;
    // border: thin solid white;
    border-left: 0px;
    color: white;
    padding: 5px 25px;
    background-color: #2196F3;
  }
}
.closed-banner {
  position: absolute;
  top: 15px;
  z-index: 1;
  opacity: 0.97 !important;

  display: inline;
  span {
    border-radius: 0 5px 5px 0;
    // border: thin solid white;
    border-left: 0px;
    color: white;
    padding: 5px 25px;
    background-color: #2196F3;
  }
}
.event-container {
  .event-container-row {
    .event-container-col {
      .event-card {
        border-radius: 5px;
        @media screen and (min-width: 960px) {
          min-height: 560px;
        }
       
        .event-card-inner {
          height: 290px;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: hidden;
          @media screen and (max-width: 959px) {
            height: 56vw;
          }
          @media screen and (max-width: 599px) {
            height: 75vw;
          }
          .event-card-img {
            width: auto;
            height: 290px;
            @media screen and (max-width: 959px) {
              height: 56vw;
            }
            @media screen and (max-width: 599px) {
              height: 75vw;
            }
            object-fit: cover;
            border-radius: 5px 5px 0 0;
          }
        }
      }
    }
  }
}
.card-title {
  font-size: 22px;
  line-height: 1.7rem;
  padding: 21px 24px 4px;
  @media screen and (max-width: $sp-max-width) {
    font-size: 20px;
    line-height: 1.5rem;
    padding-top: 15px;
  }
}
.tag-container {
  padding: 10px;
}
.card-details {
  font-size: 20px;
  @media screen and (max-width: $sp-max-width) {
    font-size: 16px;
  }
}
.carousel {
  height: 33vw;
  background-color: rgb(224,224,224);
  // box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 1920px) {
    height: 580px !important;
  }
  @media screen and (max-width: 1600px) {
    height: 480px !important;
  }
  @media screen and (max-width: 1000px) {
    height: 380px !important;
  }
  @media screen and (max-width: $sp-max-width) {
    height: 320px !important;
  }
  .carousel-item {
    height: 33vw;
    position: relative;
    width: 100%;
    font-size: 0;
    @media screen and (max-width: 1920px) {
      height: 580px !important;
    }
    @media screen and (max-width: 1600px) {
      height: 480px !important;
    }
    @media screen and (max-width: 1000px) {
      height: 380px !important;
    }
    @media screen and (max-width: $sp-max-width) {
      height: 320px !important;
    }
    .img-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(128, 128, 128, 0.75);
    }
    #carousel-img {
      filter: brightness(90%);
    }
    .carousel-img {
      object-fit: cover;
      height: 33vw;
      @media screen and (max-width: 1920px) {
        height: 580px !important;
      }
      @media screen and (max-width: 1600px) {
        height: 480px !important;
      }
      @media screen and (max-width: 1000px) {
        height: 380px !important;
      }
      @media screen and (max-width: $sp-max-width) {
        height: 320px !important;
      }
      .carousel-inner {
        .carousel-row {
          .carousel-col {
            .carousel-div {
              background-color: rgba(255,255,255,0.97);
              max-width: 946px;
              margin-left: 113px;
              margin-bottom: 80px;
              // z-index: 600;
              @media screen and (max-width: 1800px) {
                margin-left: 90px;
                max-width: 860px;
              }
              @media screen and (max-width: 1600px) {
                margin-left: 80px;
                max-width: 740px;
              }
              @media screen and (max-width: 1300px) {
                margin-left: 50px;
                max-width: 600px;
                margin-top: 30px;
                margin-bottom: 0;
              }
              @media screen and (max-width: 1000px) {
                margin-left: 20px;
                max-width: 500px;
              }
              @media screen and (max-width: 800px) {
                margin-left: 15px;
                max-width: 420px;
              }
              @media screen and (max-width: $sp-max-width) {
                margin: 0 20px;
                max-width: 380px;
                padding: 0;
              }
              @media screen and (max-width: 450px) {
                margin: 0 20px;
                padding: 0;
                margin-bottom: 30px;
              }
              .carousel-top {
                padding: 10px;
                margin-bottom: 25px;
                padding-bottom: 0;
                @media screen and (max-width: 1300px) {
                  margin-bottom: 16px;
                }
                @media screen and (max-width: $sp-max-width) {
                  max-width: 300px;
                }
                h2 {
                  margin: 0 0 12px;
                  object-fit: contain;
                  -webkit-text-stroke: 1px rgba(0, 0, 0, 0);
                  // font-family: 'Source Sans Pro';
                  font-size: 50px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.2;
                  letter-spacing: normal;
                  text-align: left;
                  color: $jblue;
                  @media screen and (max-width: 1800px) {
                    font-size: 45px;
                  }
                  @media screen and (max-width: 1600px) {
                    font-size: 38px;
                  }
                  @media screen and (max-width: 1300px) {
                    font-size: 34px;
                  }
                  @media screen and (max-width: 1000px) {
                    font-size: 30px;
                  }
                  @media screen and (max-width: 800px) {
                    font-size: 28px;
                  }
                  @media screen and (max-width: $sp-max-width) {
                    font-size: 24px;
                  }
                  @media screen and (max-width: 400px) {
                    font-size: 22px;
                  }
                }
              }
              .carousel-bottom {
                padding: 10px;
                padding-top: 0;
                h3 {
                  margin: 12px 0px 0 0;
                  object-fit: contain;
                  -webkit-text-stroke: 1px rgba(0, 0, 0, 0);
                  // font-family: 'Source Sans Pro';
                  font-size: 30px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  text-align: left;
                  color: #4b4b4b;
                  @media screen and (max-width: 1800px) {
                    font-size: 28px;
                  }
                  @media screen and (max-width: 1600px) {
                    font-size: 26px;
                  }
                  @media screen and (max-width: 1300px) {
                    font-size: 24px;
                  }
                  @media screen and (max-width: 1000px) {
                    font-size: 22px;
                  }
                  @media screen and (max-width: 800px) {
                    font-size: 20px;
                  }
                  @media screen and (max-width: $sp-max-width) {
                    font-size: 18px;
                  }
                  @media screen and (max-width: 400px) {
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .carousel-item:last-child {
    .carousel-img {
      .carousel-inner {
        .carousel-row {
          .carousel-col {
            .carousel-div {
              @media screen and (max-width: 1000px) {
                margin: 0 20px;
                padding: 0;
                margin-top: 0px;
                margin-bottom: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
