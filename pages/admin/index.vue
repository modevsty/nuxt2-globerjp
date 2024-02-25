<template>
  <div>
    <Spinner color="white" v-if="!user"></Spinner>
    <v-container v-else>
      <v-row v-if="!isAdmin">
        You are not an admin.
        Go to&nbsp;<NuxtLink class="primary--text" to="/dashboard">
          your page
        </NuxtLink>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="12">
          <h1>User Profile</h1>
          <p>You are the admin</p>
          <!-- <p v-if="firstName || lastName">Your name is {{ [firstName, lastName].join(" ") }}</p>
          <p>Your e-mail is {{ user.email }}</p>
          <p v-if="user.emailVerified">Your e-mail is verified! </p>
          <p v-if="country">Your country is {{ country }}</p>
          <p v-if="university">Your university is {{ university }}</p>
          <p v-if="expectedGraduationYear">Your graduating year is {{ expectedGraduationYear }}</p>
          <p v-if="major">Your major is {{ major }}</p>
          <p v-if="degree">Your degree is {{ degree }}</p> -->
          
        </v-col>
        <v-col cols = "12">
          <v-btn
            color="white primary--text"
            nuxt-link to="/admin/events"
          >
            Go to your events page
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="white primary--text"
            nuxt-link to="/admin/blogs"
          >
            Go to all blogs page
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="white primary--text"
            nuxt-link to="/admin/accounts"
          >
            Go to all accounts page
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="white primary--text"
            nuxt-link to="/admin/news"
          >
            Go to all news page
          </v-btn>
        </v-col>
         <v-col cols="12">
          <v-btn
            color="white primary--text"
            nuxt-link to="/surveys"
          >
            Go to your surveys page
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Spinner from '@/components/LoadingSpinner'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner },
  layout: "default",
  name: "admin",
  ...mapActions({
    fetchAccount: 'account/FETCH_ACCOUNT'
  }),
  ...mapMutations({
    setAccount: 'account/SET_ACCOUNT'
  }),
  // async created() {
  //   await this.getInfo();
  // },
  computed: {
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
  // methods: {
  //   async getInfo() {
  //     await this.fetchAccount();
  //   }
  // }
}
</script>
