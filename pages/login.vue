<template>
  <div class="container fill-height d-flex flex-column justify-center align-center">
    <!-- <v-row v-if="User">{{User.email}}</v-row> -->
    <div v-if="isLoading" class="spinner-container">
      <GloberSpinner  class="top-spinner"></GloberSpinner>
    </div>
    <v-row class="d-flex justify-center align-center" v-else>
      <v-col>
        <v-card else style="max-width: 100%; width: 450px;" class="mx-auto" outlined>
          <v-alert type="error" :value="!!error">{{ error }}</v-alert>
          <v-alert type="success" :value="!!success">{{ success }}</v-alert>
          <div>
            <v-row class="d-flex justify-start">
              <v-col>
                <div style="width: fit-content" @click.prevent="handleBack" >
                  <v-icon style="font-size: 24px" class="primary--text pt-3 pl-3">mdi-arrow-left-circle</v-icon>
                </div>
              </v-col>
            </v-row>
          </div>
          <v-card-title class="justify-center pt-0 pb-4 font-weight-bold">
            Log In
          </v-card-title>
          <v-form @submit.prevent="userLogin">
            <v-card-text>
              <v-text-field
                v-model="email"
                label="Email Address"
                outlined
                prepend-icon="mdi-email-outline"
              />
              <v-text-field
                v-model="password"
                label="Password"
                outlined
                :append-icon="passwordValue ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (passwordValue = !passwordValue)"
                :type="passwordValue ? 'password' : 'text'"
                prepend-icon="mdi-lock"
              />
              <v-checkbox
                class="pt-0 mt-0"
                v-model="persist"
                label="Keep me logged in"
              ></v-checkbox>
              <v-card-actions class="pt-0 mt-0">
                <v-spacer />
                <v-btn color="primary" xs="6" type="submit" :disabled="isLoading">User Login</v-btn>
              </v-card-actions>
              <v-row class="pt-4">
                <v-col cols="6" class="text-left">
                  New user?  <nuxt-link class="primary--text" to="/signup">
                    Signup
                  </nuxt-link>
                </v-col>
                <v-col cols="6" class="text-right">
                  Forgot password? <nuxt-link class="primary--text" to="/password-reset">
                    here
                  </nuxt-link>
                </v-col>
              </v-row>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="5.5"><v-divider class="text-center"></v-divider></v-col>
                <v-col cols="1" class="text-center pa-0"><span>OR</span></v-col>
                <v-col cols="5.5"><v-divider class=" text-center"></v-divider></v-col>
              </v-row>
              <v-row class="mt-1">

                <v-col cols="12">
               
                <v-btn 
                  class="login-btn pa-2"
                  style="width:100%;"
                  @click="googleLogin"
                  large>
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                  &nbsp;&nbsp;Login with Google
                  </v-btn>
                 </v-col>
              </v-row>
            </v-card-text>
          </v-form>
        </v-card>
        <v-row>
          <v-col class="text-center">
            <nuxt-link class="text-center" style="font-size: 14px;" :to="'/privacy'">
              Privacy Policy
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GloberSpinner from '@/components/GloberSpinner'
export default {
  layout: "loginLayout",
  components: {
    GloberSpinner
  },
  data() {
    return {
      isLoading: true,
      passwordValue: true,
      email: "",
      password: "",
      persist: false,
      token: null,
      user_id: null,
      error: null,
      success: null,
    };
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    }
  },
  mounted() {
    if(this.$store.getters["isLoggedIn"]) {
      // this.$router.back()
      const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
      if (beforeLoginPath) {
        this.$router.push({path: beforeLoginPath})
        localStorage.removeItem('BEFORE_LOGIN_PATH')
      } else {
        this.$router.push({path: '/dashboard'})
      }
    }

    this.$fire.auth.getRedirectResult().then(result => {
      // console.log('result', result)
      if (!result.user && !this.$fire.auth.currentUser) {
        this.isLoading = false
      }
    });
  },
  methods: {
    handleBack() {
      const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
      if (!!beforeLoginPath) {
        this.$router.push({path: beforeLoginPath})
        localStorage.removeItem('BEFORE_LOGIN_PATH');
      } else {
        this.$nuxt.$router.push({path: '/'})
      }
    },
    async userLogin() {
      this.isLoading = true
      let persistence = "session"
      if (this.persist) {
        persistence = "local"
      }
      try {
        await this.$fire.auth.setPersistence(persistence)
        .then(async () => {
          await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
          )
          .then(async res => {
            if (!res.user.emailVerified) {
              await this.$fire.auth.currentUser.sendEmailVerification()
              .then(() => {
                this.isLoading = false
                this.error = "Email is not verified. Verification email resent. Please verify your email to login."
              })
              .catch(err => {
                this.isLoading = false
                let mes = err.message.split(/[(:]+/)
                if(mes[0] === 'Firebase') {
                  this.success = null;
                  mes.shift()
                  mes.pop()
                  this.error = mes.join("(")
                }
                // throw("Email is not verified. Please verify your email to login.")
              })
              await this.$fire.auth.signOut()
            } else {
              const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
              // this.$router.push({path: '/feed'})
              if (beforeLoginPath) {
                localStorage.removeItem('BEFORE_LOGIN_PATH')
                window.location.href = beforeLoginPath
                // this.$router.push({path: beforeLoginPath}).then(() => location.reload())
                
              } else {
                window.location.href = '/dashboard'
                // this.$router.push({path: '/dashboard'}).then(() => location.reload())
              }
            }
          })
        })
      } catch (err) {
        this.isLoading = false
        await this.$fire.auth.signOut()
        let mes = err.message.split(/[(:]+/)
        if(mes[0] === 'Firebase') {
          this.success = null;
          mes.shift()
          mes.pop()
          this.error = mes.join("(")
        }
      }
    },
    // googleLoginTimeout() {
    //   setTimeout(async function() {
    //     await this.googleLogin()
    //   }, 100)
    // },
    async googleLogin() {
      const provider = new this.$fireModule.default.auth.GoogleAuthProvider()
      // provider.setCustomParameters({ redirect_uri: 'https://www.globerjp.com/dashboard' });
      try {
        await this.$fire.auth.signInWithPopup(provider)
          .then(async res => {
            this.isLoading = true
            const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
              // this.$router.push({path: '/feed'})
            if (beforeLoginPath) {
              localStorage.removeItem('BEFORE_LOGIN_PATH')
              window.location.href = beforeLoginPath
              // this.$router.push({path: beforeLoginPath}).then(() => location.reload())
              
            } else {
              window.location.href = '/dashboard'
              // this.$router.push({path: '/dashboard'}).then(() => location.reload())
            }
            
          })
        // if (this.isMobileScreen) {
        //   await this.$fire.auth.signInWithPopup(provider)
        //   .then(async res => {
        //     this.isLoading = true
        //     const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
        //       // this.$router.push({path: '/feed'})
        //     if (beforeLoginPath) {
        //       localStorage.removeItem('BEFORE_LOGIN_PATH')
        //       window.location.href = beforeLoginPath
        //       // this.$router.push({path: beforeLoginPath}).then(() => location.reload())
              
        //     } else {
        //       window.location.href = '/dashboard'
        //       // this.$router.push({path: '/dashboard'}).then(() => location.reload())
        //     }
            
        //   }).catch(async err => {
        //     this.isLoading = false
        //     await this.$fire.auth.signOut()

        //     let mes = err.message.split(/[(:]+/)
        //     if(mes[0] === 'Firebase') {
        //       this.success = null;
        //       mes.shift()
        //       mes.pop()
        //       this.error = mes.join("(")
        //     }
        //   }) 
        // } else {
        //   this.isLoading = true
        //   await this.$fire.auth.signInWithRedirect(provider)
        // }

          // await this.$fire.auth.signInWithRedirect(provider)
          // .then(async res => {
          //   // await res.user.getIdToken(true).then(idToken => {
          //   //   localStorage.setItem('access_token', idToken.toString())
          //   //   localStorage.setItem('refresh_token', res.user.refreshToken.toString())
          //   // })
            
          // }).catch(async err => {
          //   this.isLoading = false
          //   await this.$fire.auth.signOut()

          //   let mes = err.message.split(/[(:]+/)
          //   if(mes[0] === 'Firebase') {
          //     this.success = null;
          //     mes.shift()
          //     mes.pop()
          //     this.error = mes.join("(")
          //   }
          // }) 
      } 
      catch (err) {
        this.isLoading = false
        await this.$fire.auth.signOut()

        // let mes = err.message.split(/[(:]+/)
        // if(mes[0] === 'Firebase') {
        //   this.success = null;
        //   mes.shift()
        //   mes.pop()
        //   this.error = mes.join("(")
        // }
      }
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>
<style lang="scss" scoped>
.container {
  width: 100%;
    padding: 0 12px;
    margin-right: auto;
    margin-left: auto;
}
.spinner-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  height: 100svh !important;

  .top-spinner {
    margin-top: -45px !important; 
    height: fit-content;
    width: fit-content;
  }
}
</style>
