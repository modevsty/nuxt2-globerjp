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
      <div v-else>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
        <div v-else>
          <v-card >
                    <v-alert style="position:fixed;left: 50%;
  z-index:100;
  bottom: 50px;
  transform: translate(-50%, -50%);
  margin: 0 auto; " type="success" :value="!!success">{{ success }}</v-alert>
          <v-alert style="position:fixed;left: 50%;
  z-index:100;
  bottom: 50px;
  transform: translate(-50%, -50%);
  margin: 0 auto; " type="error" :value="!!error">{{ error }}</v-alert>
          </v-card>
          <AccountList :users="users" :type="'Properly Registered Users'" class="mt-5 mb-5"/>
          <AccountList :users="notYetUsers"  :type="'Not yet Completely Registered Users'" class="mt-5 mb-5"/>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
import Spinner from '@/components/LoadingSpinner'
import AccountList from '@/components/AccountList';
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner, AccountList },
  layout: "default",
  name: "admin",
  data() {
    return {
      imgFailed: false,
      success: null,
      error: null,
    }
  },
  ...mapActions({
    fetchAccount: 'account/FETCH_ACCOUNT'
  }),
  ...mapMutations({
    setAccount: 'account/SET_ACCOUNT'
  }),

  async asyncData({store, $fire, $moment, route}) {
    let querySnapShot = await $fire.firestore.collection('users')
    .get()

    let users= []
    if (querySnapShot.size > 0 ) {
      for (const doc of querySnapShot.docs) {
        let id = doc.id;
        let data = doc.data();
        users.push({
          ...data,
          id,
        })
      }
      
    }
    let pageLoaded = true;
    let allSortedUsers = users.sort(function(a,b) {return a.firstName === b.firstName? 0 : (a.firstName > b.firstName? 1: -1) })
    
    let notYetUsers = allSortedUsers.filter(e=>!e.firstName)
    let sortedUsers = allSortedUsers.filter(e=>e.firstName)

    return {
      pageLoaded,
      notYetUsers,
      users: sortedUsers
    }
    
  },

  computed: {
    emailList() {
      if (!this.users) return ''
      return this.users.map(e=>{return e.email}).join(', ')
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
  methods: {
    copyEmail() {
      if (process.browser) {
        // /* Get the text field */
        let copyText = document.getElementById("myInput");

        // /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */

        navigator.clipboard
          .writeText(copyText.value)
          .then(() => {
            this.success = "Successfully copied emails!!"
            setTimeout(()=>{
              this.success = null
            },2000)
          })
          .catch(() => {
            this.error = "Something went wrong!!"
            setTimeout(()=>{
              this.error = null
            },2000)
          });
      }
    },
  }
}
</script>