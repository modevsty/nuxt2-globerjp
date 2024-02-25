<template>
  <div>
    <div class="toolbar-header d-flex justify-center align-center px-5">
      <v-toolbar-title class="headline text-uppercase d-flex justify-center align-center" style="height:100%;">
        <nuxt-link to="/" class="container-logo font-weight-bold black--text d-flex justify-center align-center" style="height: 100%;">
          <!-- <div class="primary--text text-lowercase">glober</div> -->
          <div class="glober-logo">
            <img contain :src="logo"/>
          </div>
          <h1 style="display:none">
            glober - Event Sharing Site for Students
          </h1>
        </nuxt-link>

      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/admin" v-show="user && isAdmin" nuxt
        icon
        style="height: 100%;"
        color="red"
        >
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn to="/organizer" v-show="user && isOrganizer" nuxt
        icon
        style="height: 100%;"
        color="blue"
        >
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-spacer />
      <div class="d-flex justify-center align-center" style="height:100%;">
        <v-btn
          v-show ="user"
          class="primary--text text-capitalize"
          @click.stop="logout()"
          exact
          >logout</v-btn
        >
        <v-btn
          v-show ="!user"
          class="primary--text text-capitalize"
          @click.stop="login()"
          exact
          >login</v-btn
        >
        </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      logo: 'data:image/png;base64,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',
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      error: null,
      success: null
    };
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
  methods: {
    ...mapMutations({
      logoutAccount: 'account/LOGOUT_ACCOUNT'
    }),
    linkTo(address) {
      this.$router.push({ path: `/${address}` });
    },
    login() {
      if (this.$store.getters["isLoggedIn"]) {
        this.$router.push("/dashboard")
      } else {
        localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
        this.$router.push({path: '/login'});
      }
    },
    async logout() {
      await this.$fire.auth.signOut()
      this.logoutAccount()
      if (this.$route.path === '/') {
        location.reload()
      } else {
        // this.$router.go({path: '/', force: true});
        window.location.href = '/'
        // this.$router.push({path: '/'}).then(() => location.reload())
      }
     
    }
  }
};
</script>
<style lang="scss" scoped>
// .glober-logo {
//   height: 180px;
//   width: 180px;
//   transform: rotateY(360deg);
//   animation: turn 2.0s ease-out forwards 1s;
// }

// @keyframes turn {
//   100% {
//     transform: rotateY(0deg);
//   }
// }
.glober-logo {
  display: flex;
  height: fit-content; 
  width : 70px;
  padding-top: 4px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media screen and (max-width:599px) {
    height: fit-content; 
    width : 70px;
    padding-top: 4px;
  }
  
}
.toolbar-header {
  min-height: 56px;
  background-color: #FFFFFF;
  contain: layout;
    display: block;
    flex: 1 1 auto;
    max-width: 100%;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) transform, 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color, 0.2s cubic-bezier(0.4, 0, 0.2, 1) left, 0.2s cubic-bezier(0.4, 0, 0.2, 1) right, 280ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 0.25s cubic-bezier(0.4, 0, 0.2, 1) max-width, 0.25s cubic-bezier(0.4, 0, 0.2, 1) width;
    position: relative;
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
.v-sheet {
    border-radius: 0;
}

.v-toolbar {
  // contain: layout;
  // display: block;
  // flex: 1 1 auto;
  max-width: 100%;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) transform, 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color, 0.2s cubic-bezier(0.4, 0, 0.2, 1) left, 0.2s cubic-bezier(0.4, 0, 0.2, 1) right, 280ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 0.25s cubic-bezier(0.4, 0, 0.2, 1) max-width, 0.25s cubic-bezier(0.4, 0, 0.2, 1) width;
  position: relative;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
  @media screen and (min-width: 960px) {
    min-height: 64px;
  }
}
</style>