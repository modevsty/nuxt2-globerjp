<template>
  <div class="container fill-height d-flex align-center justify-center">
    <!-- <v-row v-if="User">{{User.email}}</v-row> -->
    <v-row>

      <v-col style="position:relative">
        <Spinner style="position:absolute; left: 0; right:0; margin-auto;margin-top:-90px; " v-if="isLoading" />
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
            Password Reset
          </v-card-title>
          <v-form @submit.prevent="passReset">
            <v-card-text>
              <v-text-field
                v-model="email"
                label="Email Address"
                outlined
                prepend-icon="mdi-email-outline"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" type="submit" :disabled="isDisabled">Send Reset Email</v-btn>
              </v-card-actions>
              <v-row>
                <v-col cols="6" >
                <v-card-text class="d-flex justify-start align-left">
                  <v-row>
                    <v-col class="text-left">
                  New user? <nuxt-link class="primary--text" to="/signup">
                     Signup
                  </nuxt-link>
                  </v-col>
                  </v-row>
                </v-card-text>
                </v-col>
                <v-col cols="6">
                <v-card-text class="d-flex justify-start  align-left">
                  <v-row>
                  <v-col class="text-right">
                  Already a user? <nuxt-link class="primary--text" to="/login">
                    Login
                  </nuxt-link>
                  </v-col>
                  </v-row>
                </v-card-text>
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
      email: "",
      password: "",
      token: null,
      user_id: null,
      error: null,
      success: null,
    };
  },
  mounted() {
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
    async passReset() {
      this.isLoading = true;
      this.isDisabled = true;
      this.$forceUpdate()
      try {
        await this.$fire.auth.sendPasswordResetEmail(
        this.email).then(() => {
          this.isLoading = false
          setTimeout(() => {
            this.isDisabled = false;
          },3000)
         
          this.success = "Password Reset Email sent!! Please check your spam folder too!"
          this.error = null
        })
      } catch (err) {
        this.isLoading = false
        this.isDisabled = false;
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

