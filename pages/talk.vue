<template>
  <div :style="currentState?{position:'fixed', top: '60px', left: 0, right: 0, margin:'auto',}:{position:'fixed', top: '0px'}" :class="[!currentState? 'pos-bot chat-container-outer-not-state': 'chat-container-outer-state']" >
    <Spinner color="blue" v-if="!isMounted"></Spinner>
    <div v-else>
          <client-only>
      <v-container v-if="!user">
        <h1>
          You must be logged in to view this page.
        </h1>
        <v-btn
          color="#2196F3"
          class="pa-0"
          style="text-transform: unset !important; font-size: 16px !important;"
          @click="handleJoin()"
          text
          >Click here to Join</v-btn
        >
      </v-container>
      <v-container :style="isDevice && currentState?{
        height: screenHeight,
        position: 'sticky',
        top: '0px'
      }: {}" class="pa-0" :class="[!currentState? 'chat-container-not-state' : 'chat-container-state']" v-else>
        <client-only>
        <Chat
        ref="scrollContainer"
        :showChat="showChat"
        :isDevice="isDevice"
        :currentUserId="currentUserId"
        :isAdmin="isAdmin"
        :screenHeight="screenHeight"
        @show-demo-options="showHandler"
        />
        </client-only>
      </v-container>
    </client-only>
    </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import Chat from '@/components/Chat.vue'
import Spinner from '@/components/LoadingSpinner'
export default {
  // layout: 'empty',
  head: {
    title: 'glober chat'
  },
  name: 'chat',
  components: {
    Chat,
    Spinner
  },
  data() {
    return {
      isMounted: false,
      historySet: false,
      currentUserId: '',
      isDevice: false,
      screenHeight: '',
      currentState: true,
      showChat: true
    }
    
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
    ...mapGetters({
      isAdmin: "account/ISADMIN",
      isOrganizer: "account/ISORGANIZER"
    }),
  },
  async mounted() {
    this.isMounted = true
    if (this.user) {
      this.isMounted=true;
      this.setHeight()
      window.addEventListener('resize', this.setHeight)
      // window.addEventListener('scroll', this.setHeight)
      this.currentUserId = this.user.uid
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'chat') {
        this.setHeight()
        window.removeEventListener('resize', this.setHeight);
        // window.removeEventListener('scroll', this.setHeight)
        window.addEventListener('resize', this.setHeight)
        // window.addEventListener('scroll', this.setHeight)
      }
      if (from.name === 'chat') {
        window.removeEventListener('resize', this.setHeight);
        // window.removeEventListener('scroll', this.setHeight)
      }
    },
  },
  destroyed() {
    if (process.browser) {
      // this.showChat = false
       this.$forceUpdate()
      window.removeEventListener('resize', this.setHeight);
      // window.removeEventListener('scroll', this.setHeight)
      
      // this.isMounted = false;
    }
  },
  methods: {
    setHeight() {
      this.$nextTick(()=> {
        this.getHeight()
        this.isDevice = window.innerWidth < 500
        this.screenHeight = this.isDevice ? (( !this.currentState? `calc(${window.innerHeight}px)` : `calc(${window.innerHeight}px - 110px)`)) : `calc(${window.innerHeight}px - 120px)`
      })
    },
    showHandler(val) {
      if (this.isMounted && this.isDevice && !val) {
          if (!this.historySet) {
            setTimeout(()=>{
              
              window.history.pushState(null, null, '/chitchat');
            })
            this.historySet = true
           
          } 
          else {
            window.history.replaceState(null, null, '/chitchat');
          }
      }
      if (this.isDevice && val) {
        // this.showChat = false
        this.$forceUpdate()
        
        window.history.go(-1)

        
      }

      if(this.isDevice || val) {
        this.currentState = val
         $nuxt.$emit('topEmit', val)
         this.setHeight()
      }
     
    },
    getHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh',`${vh}px`);
      // $nuxt.$emit('topEmitEmpty', vh)
    },
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
  }
}
</script>
<style lang="scss" scoped>
.chat-container-not-state {
  @media screen and (max-width: 500px) {
    height: 100%;
    // background-color: green;
     width: 100%;
    max-height: calc(var(--vh, 1vh) * 100) !important;
  }
}
.chat-container-state {
  @media screen and (max-width: 500px) {
    height: 100%;
     width: 100%;
    // background-color: green;
    max-height: calc(var(--vh, 1vh) * 100) !important;
  }
}
.chat-container-outer-not-state {
  @media screen and (max-width: 500px) {
    height: 100%;
    // background-color: red;

    width: 100%;
    max-height: calc(var(--vh, 1vh) * 100) !important;
  }
  
}
.chat-container-outer-state {
  @media screen and (max-width: 500px) {
    height: 100%;
    // background-color: red;

    width: 100%;
    max-height: calc(var(--vh, 1vh) * 100) !important;
  }
  
}
.pos-bot {
  @media screen and (max-width: 500px) {

    position: fixed;
  
    bottom: 0;
  }
}
</style>