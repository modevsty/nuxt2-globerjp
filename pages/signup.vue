<template>
  <div class="container fill-height d-flex align-center justify-center">
    <!-- <v-row v-if="User">{{User.email}}</v-row> -->
    <v-row>

      <v-col style="position: relative">
        <!-- <v-card v-if="$auth.$state.loggedIn" max-width="450" class="mx-auto">
          <v-alert type="error" :value="!!error">{{ error }}</v-alert>
          <v-card-text>
            Logged in as {{ $auth.$state.user.user_id }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="primary" @click="logout">Log Out</v-btn>
          </v-card-actions>
        </v-card> -->
        <Spinner style="position:absolute; left: 0; right:0; margin-auto;margin-top:-90px; " v-if="isLoading" />
        <v-card else max-width="450" class="mx-auto" outlined>
          <v-alert type="error" :value="!!error">{{ error }}</v-alert>
          <v-alert type="success" :value="!!success">{{ success }}</v-alert>
          <v-container>
            <v-row class="d-flex justify-start">
              <v-col>
                <div style="width: fit-content" @click.prevent="handleBack" >
                  <v-icon style="font-size: 24px" class="primary--text pt-3 pl-3">mdi-arrow-left-circle</v-icon>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-card-title class="justify-center pt-0 pb-6 font-weight-bold">
            Sign Up
          </v-card-title>
          <v-form @submit.prevent="userSignup">
            <v-card-text>
              <v-text-field
                class="primary--text"
                v-model="email"
                label="Email Address"
                outlined
                prepend-icon="mdi-email-outline"
              />
              <v-text-field
                class="primary--text"
                v-model="password"
                label="Password"
                :append-icon="passwordValue ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (passwordValue = !passwordValue)"
                :type="passwordValue ? 'password' : 'text'"
                outlined
                prepend-icon="mdi-lock"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" type="submit" :disabled="isDisabled">Signup</v-btn>
              </v-card-actions>
              <v-card-text>
                Already a user?  <nuxt-link class="primary--text" to="/login" >
                  Login
                </nuxt-link>
              </v-card-text>
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
import Spinner from '@/components/LoadingSpinner'
export default {
  layout: "loginLayout",
  components: {
    Spinner
  },
  data() {
    return {
      isLoading: false,
      isDisabled: false,
      passwordValue: true,
      email: "",
      password: "",
      token: null,
      user_id: null,
      error: null,
      success: null,
    };
  },
  created() {
    if(this.$store.getters["isLoggedIn"]) {
        const beforeLoginPath = localStorage.getItem('BEFORE_LOGIN_PATH')
        if (beforeLoginPath) {
          this.$router.push({path: beforeLoginPath})
          localStorage.removeItem('BEFORE_LOGIN_PATH')
        } else {
          this.$router.push({path: '/dashboard'})
        }
    }
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
    async userSignup() {
      this.isLoading = true;
      this.isDisabled = true;
      this.$forceUpdate()
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        ).then(async () => {
          await this.$fire.auth.currentUser.sendEmailVerification().then(() => {
            this.success = "Verification email sent! Please check email spam folder too."
            this.error = null
            this.email = ""
            this.password = ""
            this.isLoading = false
            setTimeout(() => {
              this.isDisabled = false
            },3000)
          }).catch(err => { 
            this.isLoading = false
            this.isDisabled = false
            let mes = err.message.split(/[(:]+/)
            if(mes[0] === 'Firebase') {
              this.success = null;
              mes.shift()
              mes.pop()
              this.error = mes.join("(")
            }
          })
          await this.$fire.auth.signOut()
        })
      } catch (err) {
        this.isLoading = false
        this.isDisabled = false
        await this.$fire.auth.signOut()
        let mes = err.message.split(/[(:]+/)
        if(mes[0] === 'Firebase') {
          this.success = null;
          mes.shift()
          mes.pop()
          this.error = mes.join("(")
        }
      }      
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
.container {
  width: 100%;
    padding: 0 12px;
    margin-right: auto;
    margin-left: auto;
}
</style>

