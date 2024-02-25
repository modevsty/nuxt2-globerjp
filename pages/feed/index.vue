<template>
  <!-- <v-container v-if="!user">
    <div>
      <h1 style="margin-bottom: 16px;">
        You must be logged in to view this page.
      </h1>
      <p>
      Go to <NuxtLink class="primary--text" color="blue" to="/">
          Home page
      </NuxtLink>
      </p>
    </div>
  </v-container> -->
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
  <v-container v-else class="d-flex flex-column justify-center pa-0">
    <h1 class="d-flex justify-center align-center mt-7 mb-3 mt-md-9 blue--text text-decoration-underline" style="text-align:center;width:100%"> Welcome </h1>
    <!-- <DynamicScroller
      :items="posts"
      :min-item-size="0"
      class="scroller"
      style="height: 100%;width:100%;"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
            item.comment,
          ]"
          :data-index="index"
        >
          <Post :post="item" class="mb-0 pa-0" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller> -->

    <!-- <DynamicScroller
      style="width: 100%; height: 100%;"
      class="scroller"
      :items="posts"
      :min-item-size="100"
      key-field="id"
    >
    <template v-slot="{item, index, active}">
      <DynamicScrollerItem
          :item="item"
          :active="item.images.length >= 6?true: false"
          :size-dependencies="[item]"
          :data-index="index"
        >
        <div>{{item.comment}}</div>
          <Post :post="item" :value="item.images.length >= 6?true: false" class="mb-0 pa-0" />
        </DynamicScrollerItem>
    </template>
   
  </DynamicScroller> -->
      <!-- <RecycleScroller
      style="width: 100%; height: 100%;"
      :items="posts"
      :item-size="100"
      key-field="id"
      :emitUpdate="true"
    >
    <template v-slot="{item, index, active}">
      <Post :post="item" class="mb-0 pa-0" />
    </template>
   
  </RecycleScroller> -->
  <!-- <VirtualList
      :data-key="'id'"
      :estimate-size="750"
      :keeps="4"
      :bottom-threshold="0"
      :data-sources="posts"
      page-mode
      :extra-props="{isMobileScreen}"
      :data-component="itemComponent"
      @tobottom="loadUntilSome"
    >
   
  </VirtualList> -->

  <DynamicScroller
    :items="posts"
    :min-item-size="10"
    :prerender="5"
    page-mode
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.alteredComment, item.images
        ]"
        :data-index="index"
      >
        <Post :source="item" :isMobileScreen="isMobileScreen"/>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <Spinner v-if="isLoading && isMounted" style="min-height: 90px;"/>
  <div class="d-flex justify-center align-center">
  <v-card-title v-if="eof" style="min-height:90px; width: fit-content;">No more posts.</v-card-title>
  </div>
  <v-dialog
  v-if="user"
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
        :disabled="imageDialogDisabled"
        @click="closeImageDialog"
      >
                            
        <v-icon color="black">mdi-window-close</v-icon>

      </v-btn>
    <v-card-text style="max-height: 100%;" class="px-0 px-sm-5">
      <client-only>
      <v-card-title class="font-weight-bold">
        Add Event Photos
      </v-card-title>
      <div class="pa-5 event-photos-card" >
        <v-card-title class="pa-0 py-2" style="word-break:break-word">
          Select a Registered Event
        </v-card-title>
        <v-select
          v-if="isMobileScreen"
          v-model="selectedEvent"
          :items="registeredEvents"
          item-text="title"
          return-object
          @change="getEventImages"
          label="Select an Event"
        ></v-select>
        <v-autocomplete
          v-else
          v-model="selectedEvent"
          :items="registeredEvents"
          item-text="title"
          return-object
          @change="getEventImages"
          :menu-props="{closeOnClick:true}"
          label="Select an Event"
        ></v-autocomplete>
        <ImageUploader v-if="eventImages" v-model="eventImages" @imageUpdating="imageUpdatingHandler"  @imageUpdated="imageUpdatedHandler" />
      </div>
      </client-only>
    </v-card-text>
  </v-card>
</v-dialog>
  <v-btn
    v-if="user" 
    @click="e => { this.imageDialog = true } "
    fab
    fixed
    right
    bottom
    large
    class="v-btn-float"
    >
    <v-icon>mdi-image-plus</v-icon>
  </v-btn>
  <!-- <RecycleScroller
    class="scroller"
    page-mode
    :items="posts"
    :item-size="800"
    :pre-render="3"
    key-field="id"
  >
  <template v-slot="{ item, index, active }">
    <Post v-observe-visibility="visibilityChanged" :source="item" :isMobileScreen="isMobileScreen"/>
  </template>
    
  </RecycleScroller> -->
    <!-- <VirtualList style="height:400px;width:100%;overflow-y: auto;"
      :data-key="'id'"
      :keeps="4"
      :estimate-size="0"
      :start="100"
      :bottom-threshold="100"
      :data-sources="posts"
      page-mode
      :data-component="itemComponent"
      @tobottom="loadUntilSome"
    >
    <div slot="footer" class="d-flex flex-column justify-center align-center" >
      <Spinner v-if="isLoading" style="min-height: 90px;" />
      <v-card-title v-if="eof" style="min-height:90px; width: fit-content;">No more posts.</v-card-title>
    </div>
   
  </VirtualList> -->
   
    
    
  </v-container>
</template>

<script>
// import ImageUploader from '@/components/ImageUploader';
// import {ObserveVisibility} from 'vue-observe-visibility'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VirtualList from 'vue-virtual-scroll-list'
import Post from '../../components/Post'
import Spinner from '@/components/LoadingSpinner'
import "emoji-mart-vue-fast/css/emoji-mart.css";
export default {
  head: {
    title: 'glober feed'
  },
  components: {
    Spinner,
    VirtualList
  },
  data() {
    return {
      imageDialogDisabled: false,
      eventImages: null,
      registeredEvents: [],
      selectedEvent: {},
      imageDialog: false,
      isMounted: false,
      // visibilityChanged: '',
      itemComponent: Post,
      savedFirstTrue: null,
      latestUpdatedAt: null,
      posts: [],
      eof: false,
      isLoading: false,
      lastDoc: null,
      batchSize: 5,
      minSize: 5,
      eventIds: {},
      userIds: {}
    }
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    },
    user() {
      return this.$store.state.authUser
    }
  },
  async mounted () {
    if (this.user) {
      // this.countMiss = this.batchSize
      this.isMounted = true;
      await this.getRegisteredEvents();
      await this.loadUntilSome()
      window.addEventListener('scroll', this.loadMore)
      // window.addEventListener('scroll', this.checkWindow)
    }
  },
  destroyed () {
    if (process.browser){
      window.removeEventListener('scroll', this.loadMore)
      //  window.removeEventListener('scroll', this.checkWindow)
    }
  },
  watch: {
    isMounted() {
      this.$nuxt.setLayout('default')
    },
    // visibilityChanged(val) {
    //   console.log('changed visibility',val)
    // },
    async $route(to, from) {
      if (to.name === 'feed') {
        await this.checkNewBlogsAndLoad();
        await this.getRegisteredEvents();
        window.addEventListener('scroll', this.loadMore)
      }
      if (from.name === 'feed') {
        window.removeEventListener('scroll', this.loadMore)
      }
    },
  },
  methods: {
    async imageUpdatingHandler(isUpdating) {
      console.log(isUpdating)
      if (isUpdating) {
        this.imageDialogDisabled = true
      } else {
        this.imageDialogDisabled = false
      }
    },
    async imageUpdatedHandler() {
      await this.checkNewBlogsAndLoad()
    },
    async closeImageDialog() {
      this.imageDialog = false
    },
    async getEventImages(event) {
      // console.log("selected thing",event)
      if (!event || !event.id) {
        this.eventImages = null;
        return
      }
      let eventId = event.id
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
    },
    async getRegisteredEvents() {
      let eventIds = await this.$fire.firestore.collection('entries')
      .where("userId","==",this.user.uid)
      .get()
      .then((querySnapshot) => {
        let out = []
        querySnapshot.forEach((res) => {
          let data = res.data()
          if (data && data.eventId) {
            out.push(
              data.eventId
            )
          }
        })
        return out
      })
      let promises = []
      for (let eventId of eventIds) {
        promises.push(this.$fire.firestore.collection('events').doc(eventId).get())
      }
      this.registeredEvents = await Promise.all(promises).then((querySnapshot) => {
        let out = []
        let todayDate = Date.now()
        querySnapshot.forEach(res => {
          let id = res.id
          let data = res.data()
          // console.log(data)
          
          // console.log(todayDate, date, todayDate > date)
          if (data && data.isPublished) {
            // let date = Date.parse(data.eventDateTo + "T" + data.eventTimeTo)
            out.push({
              id,
              ...data,
              // relevanceValue: date >= todayDate ? Number.POSITIVE_INFINITY : date,
              startDateTime: data.eventDateFrom + " " + data.eventTimeFrom,
              endDateTime: data.eventDateTo + " " + data.eventTimeTo,
              alteredLocation: data.location? data.location : (data.isOnline? 'Online' : 'N/A')
            })
          }
        })
        //unlock it for events
        if (out.length) {
          this.calculateRelevance(out)
        }
        return out
      })
    },
    calculateRelevance(eventArray) {
      let currDate = Date.now()
      let eventDateArray = eventArray.map(e=>Date.parse(e.eventDateTo + "T" + e.eventTimeTo))
      let max = eventDateArray.reduce((prev, curr) => Math.max(prev, curr), 0)
      eventArray.forEach((e,i)=>{
        let relevanceValue = eventDateArray[i] - currDate
        if (eventDateArray[i] > currDate) {
          relevanceValue = max + currDate - eventDateArray[i]
        }
        e.relevanceValue = relevanceValue
      })
      let sortedEventArray = eventArray.sort(function(a,b){return b.relevanceValue- a.relevanceValue})
      sortedEventArray.forEach((e,i) => {
        e.relevanceValue = i+1
      })
      eventArray = sortedEventArray
    },
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    async getCommentEntries(post) {
      const allCommentEntriesQuery = await this.$fire.firestore.collection('commentEntries')
      .where("eventId","==",post.eventId).get()


      // after some time open it
      // const creatorCommentEntriesQuery = await this.$fire.firestore.collection('commentEntries')
      // .where("eventId","==",post.eventId)
      // .where("creatorId","==",post.userId)
      // .get()

      // const userCommentEntries = await this.$fire.firestore.collection('commentEntries')
      // .where("userId","==",this.user.uid)
      // .where("")
      let allEmojis = {}
      let userSelectedEmojis = new Set()
      let userSelectedEmojiNatives = new Set()
      let emojiCount = 0
      if (allCommentEntriesQuery.size > 0) {
        for (const doc of allCommentEntriesQuery.docs) {
          let id = doc.id
          let data = doc.data()
          let selectedEmojis = data.selectedEmojis
          let selectedEmojiNatives = data.selectedEmojiNatives
          if (!data.creatorId || data.creatorId === post.userId) {
            selectedEmojis.forEach((e,i) => {
              allEmojis[e] = allEmojis[e]? {...allEmojis[e], count: allEmojis[e].count + 1} : {count: 1, native: selectedEmojiNatives[i]}
              emojiCount += 1
            })
            if (data.userId === this.user.uid) {
              userSelectedEmojis = new Set(selectedEmojis)
              userSelectedEmojiNatives = new Set(selectedEmojiNatives)
            }
          }
        }
      }

      post['emojis'] = allEmojis
      post['selectedEmojis'] = userSelectedEmojis
      post['selectedEmojiNatives'] = userSelectedEmojiNatives
      post['emojiCount'] = {value: emojiCount}
      
    },
    // visibilityChanged (isVisible, entry) {
    //     console.log(entry, isVisible);
    // },
    async checkNewBlogsAndLoad() {
      const db = this.$fire.firestore
      let query = db.collection('eventImages')
        .orderBy('updatedAt', 'desc')
        .limit(1)

      const querySnapShot = await query.get()
      if (querySnapShot.size > 0) {
        const data = querySnapShot.docs[0].data()
        if (data.updatedAt == this.latestUpdatedAt) {
          return
        }
        this.lastDoc = null;
        this.eof = false;
        this.posts = [];
        await this.loadUntilSome();
      }
    },

    async loadBlogs () {
      // console.log('loading blogs')
      const db = this.$fire.firestore


      let query = db.collection('eventImages')
        .orderBy('createdAt', 'desc')
        .limit(this.batchSize)


      if (!this.posts.length) {
        let query2SnapShot = await db.collection('eventImages')
        .orderBy('updatedAt', 'desc')
        .limit(1).get()
        if (query2SnapShot.size > 0) {
          const latestUpdatedData = query2SnapShot.docs[0].data()
          this.latestUpdatedAt = latestUpdatedData.updatedAt
        }
      }

      if (this.lastDoc) {
        query = query.startAfter(this.lastDoc)
      }
      
    
      const querySnapshot = await query.get()

      this.eof = querySnapshot.empty
      this.countMiss = 0
      if (querySnapshot.size > 0) {
        this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
        let promises = []
        for (const doc of querySnapshot.docs) {
          let id = doc.id;
          let data = doc.data();
          if (!data.images.length && this.posts.length) {
            this.countMiss += 1;
            if (this.posts.length) {
              continue
            }
          }
          let alteredComment = ""
          if (data.comment) {
            let match = data.comment.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
            alteredComment=data.comment;
            if (match) {
              match.map(url=>{
                alteredComment=alteredComment.replace(url,"<a style='color:blue !important' href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
              })
            }
          }
          if (!this.eventIds[data.eventId]) {
            let event = this.$fire.firestore.collection('events').doc(data.eventId).get()
            promises.push(event)
          }
          if (!this.userIds[data.userId]) {
            let user = this.$fire.firestore.collection('users').doc(data.userId).get()
            promises.push(user)
          }
          await Promise.all(promises).then((querySnapshot) => {
            querySnapshot.forEach(res => {
              let id = res.id
              let data = res.data()
              if (id && data) {
                if (data.title) {
                  this.eventIds[id] = data
                }
                if (data.email) {
                  this.userIds[id] = data
                }
              }
            })
          })
          // console.log('id',id)
          // console.log('eventids',this.eventIds[data.eventId])
          // console.log('userids',this.userIds[data.userId])
          // console.log('data',data)
          //  console.log('before loaded posts length , countmiss', this.posts.length, this.countMiss)
          if (data.images && data.images.length) {
            data.images.reverse()
            const post = {
              id,
              ...this.eventIds[data.eventId],
              ...this.userIds[data.userId],
              ...data,
              alteredComment
            }
            await this.getCommentEntries(post)
            this.posts.push(post)
          }
          
          // console.log(this.posts.length)
        }
      }
      // console.log('finally loaded posts length , countmiss', this.posts.length, this.countMiss)

    },
    async loadUntilSome() {
      // console.log('loaduntilsome')
      if (this.isLoading || this.eof) {
        return
      }
      // console.log('loaduntilsome2')
      this.isLoading = true
      this.countMiss = this.batchSize
          

      while ((this.countMiss >= (this.batchSize - 1) || this.$el.getBoundingClientRect().height <=
          (window.innerHeight || document.documentElement.clientHeight)) && !this.eof ) {
        await this.loadBlogs()
      }
      this.isLoading = false
      
    },
    loadMore () {
      if (process.browser){
        const elementBounds = this.$el.getBoundingClientRect()

        // Add extra padding to load earlier even before the bottom of the element is in view.
        const padding = this.isMobileScreen? 300 : 150

        const bottomOfWindow =
          elementBounds.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) + padding

        // console.log( elementBounds.bottom, (window.innerHeight || document.documentElement.clientHeight) + padding)
        if (bottomOfWindow && !this.isLoading && !this.eof) {
          this.loadUntilSome()
        }
      }
    },

  }
}
</script>
<style>
.resize-observer {
  height: 50px;
}
</style>
<style lang="scss" scoped>
.v-btn-float {
  margin: 60px 10px;
  color: rgb(100,100,100);

}
.v-btn::before {
    background-color: transparent;
  }
</style>