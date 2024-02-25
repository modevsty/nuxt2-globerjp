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
      <v-container v-else>
        <v-card-title class="pb-0">Your Events</v-card-title>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
        <v-container style="position:relative; margin-bottom: 25px !important;" v-else>
          <v-data-table
            :headers="[
            {text: 'Title',
            value: 'title'},
            {text: 'Start Date Time',
            value: 'startDateTime'},
            {text: 'End Date Time',
            value: 'endDateTime'},
            {text: 'Location',
            value: 'location'},
            {text: 'Is Published',
            value: 'isPublished'},
            {text: 'Created Date',
            value: 'createdDate'},
            {text: 'Updated Date',
            value: 'updatedDate'},]"
            :group-by.sync="groupBy"
            :group-desc.sync="groupDesc"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="events"
            :items-per-page="eventsPerPage"
            class="elevation-1"
            @click:row="handleClick"
          ></v-data-table>
          <!-- <template v-slot:extension>
            <v-btn
              fab
              color="cyan accent-2"
              bottom
              left
              absolute
              @click="dialog = !dialog"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template> -->
          <v-dialog
            v-model="newInfoDialog"
            offset-y
            style="float:right"
            max-width="800px"
            scrollable
          >
            <template v-slot:activator="{ on }">
              <v-row>
                <v-col class="pb-0">
                  <v-btn
                    fab
                    bottom
                    
                    absolute
                    style="margin:auto;left:0;right:0"
                    color="primary" dark v-on="on"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <!-- <v-btn style="float:right" color="primary" dark v-on="on">
                    <v-icon small>
                      mdi-pencil
                    </v-icon>
                    Edit
                  </v-btn> -->
                </v-col>
              </v-row>
            </template>
            <v-card style="height:fit-content">
              <v-card-title>
                <span class="headline">
                  Add New Event
                </span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="form"
                  class="pt-30"
                  v-model="valid"
                  lazy-validation
                >
                  <v-container style="max-width: 800px">
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="eventTitle"
                          :rules="eventTitleRules"
                          label="Event Title"
                          required
                        ></v-text-field>
                      </v-col>
                      <!-- <v-col cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="firstName"
                          :rules="nameRules"
                          label="First Name"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="lastName"
                          :rules="nameRules"
                          label="Last Name"
                          required
                        ></v-text-field>
                      </v-col> -->
                      <!-- <v-col cols="12" md="6" sm="6">
                        <v-btn
                          :disabled="!valid"
                          color="blue accent--text"
                          class="mr-4"
                          @click="validateSubmit"
                        >
                          Validate
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="6" sm="6" class="d-flex justify-md-end justify-sm-end">
                        <v-btn
                          color="white primary--text"
                          nuxt-link
                          to="/dashboard"
                        >
                          Go back
                        </v-btn>
                      </v-col>  -->
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="newInfoDialog = false">
                  Cancel</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="
                    () => {
                      validateSubmit();
                      newInfoDialog = false;
                    }
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
        </v-container>
        <v-card-title class="pb-0">All Organizers' Events</v-card-title>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
            <v-container style="position:relative" v-else>
              <v-data-table
                :headers="[
                {text: 'Title',
                value: 'title'},
                {text: 'Start Date Time',
                value: 'startDateTime'},
                {text: 'End Date Time',
                value: 'endDateTime'},
                {text: 'Is Pending',
                value: 'isPending'},
                {text: 'Is Approved',
                value: 'isApproved'},
                {text: 'Is Published',
                value: 'isPublished'},
                {text: 'Created Date',
                value: 'createdDate'},
                {text: 'Updated Date',
                value: 'updatedDate'},]"
                :group-by.sync="groupByOrganizer"
                :group-desc.sync="groupDescOrganizer"
                :sort-by.sync="sortByOrganizer"
                :sort-desc.sync="sortDescOrganizer"
                :items="eventsOrganizer"
                :items-per-page="5"
                class="elevation-1"
                @click:row="handleClickOrganizer"
              >
              
              
              </v-data-table>
     
            </v-container>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import Spinner from '@/components/LoadingSpinner'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner },
  layout: "default",
  name: "admin",
  data() {
    return {
      sortBy: "updatedDate",
      sortDesc: true,
      groupBy: 'isPublished',
      groupDesc: false,
      sortByOrganizer: "updatedDate",
      sortDescOrganizer: true,
      groupByOrganizer: 'isPending',
      groupDescOrganizer: true,
      valid: false,
      newInfoDialog: false,
      newInfoDialog2: false,
      eventTitle: "",
      eventTitleRules: [
        v => !!v || 'Event Title is required',
        v => !!v && v.length >= 5 && v.length <= 80 || 'Name must be greater than 5 and less than 80 characters',
      ],
    }
  },
  // watch: {
  //   async $route(to, from) {
  //     console.log(to, from)
  //     if (to.name === 'admin-events') {
  //       await this.getData()
  //     }
  //   },
  // },
  // mounted() {
  //   console.log("mounted")
  //   document.addEventListener("backbutton", this.getData, false);
  // },
  // beforeDestroy() {
  //   if(process.browser) {
  //     document.removeEventListener("backbutton", this.getData);
  //   }
  // },
  async asyncData({store, $fire, $moment}) {
    let events = await $fire.firestore.collection('events')
    .where("creatorId","==",store.state.authUser.uid)
    .get()
    .then((querySnapshot) => {
      let out = []
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        out.push({
          id: doc.id,
          ...data,
          startDateTime: data.eventDateFrom + " " + data.eventTimeFrom,
          endDateTime: data.eventDateTo + " " + data.eventTimeTo,
          updatedDate: !data.updatedAt? '' : moment(parseInt(data.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: !data.createdAt ? '' : moment(parseInt(data.createdAt)).format('YYYY-MM-D HH:mm:ss')
        })
      })
      return out
    })
    events = events.filter(e=>!e.isCreatorOrganizer)
    let eventsOrganizer = await $fire.firestore.collection('events')
    .where("isCreatorOrganizer","==",true)
    .get()
    .then((querySnapshot) => {
      let out = []
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        out.push({
          id: doc.id,
          ...data,
          isPending: data.isRequested && !data.isApproved,
          startDateTime: data.eventDateFrom + " " + data.eventTimeFrom,
          endDateTime: data.eventDateTo + " " + data.eventTimeTo,
          updatedDate: !data.updatedAt? '' : moment(parseInt(data.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: !data.createdAt ? '' : moment(parseInt(data.createdAt)).format('YYYY-MM-D HH:mm:ss')
        })
      })
      return out
    })
    return {
      eventsOrganizer: eventsOrganizer,
      events: events,
      pageLoaded: true
    }
    
  },
  computed: {
    eventsPerPage() {
      if(process.browser) {
        if (window.innerWidth > 800) {
          return 10
        } else {
          return 5
        }
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
  methods: {
    ...mapActions({
      fetchAccount: 'account/FETCH_ACCOUNT'
    }),
    ...mapMutations({
      setAccount: 'account/SET_ACCOUNT'
    }),
    handleClick(value) {
      if (value.isCreatorOrganizer) {
        alert("Please edit it on the organizer page since it was created using your organizer page")
        return
      }
      this.$router.push({path: `/admin/events/event/${value.id}`})
    },
    async handleClickOrganizer(event) {
      const confirmation = confirm('Click ok to approve and cancel to disapprove the requested event post.');
        // console.log(confirmation);
      let isApproved = true;
      let isPublished = event.isRequested && isApproved;
      let currDate = Date.now().toString();
      if (!confirmation) {
        isApproved = false;
        isPublished = event.isRequested && isApproved;
      }
      try{
        let data = {
          isPublished,
          publishedAt: isPublished? currDate : event.publishedAt,
          isApproved,
          updatedAt: currDate,
          isCreatorOrganizer: true
        }

        await this.$fire.firestore.collection("events").doc(event.id).update(data).then(()=>{
          event.isPublished = isPublished
          event.isApproved = isApproved
          event.publishedAt = isPublished? currDate : event.publishedAt
          event.updatedAt = currDate
          event.isPending = event.isRequested && !isApproved
          this.success = "Successfully updated!!"
          setTimeout(()=>{
            this.success = null
          },2000)
        })
      } catch(error) {
        console.log(error)
        this.error = "Could not set user information"
      }
    },
    async createNewEvent() {
      if (!this.eventTitle) return;
      let currDate = Date.now().toString()
      let data = {
        title: this.eventTitle,
        isPublished: false,
        creatorId: this.user.uid,
        createdAt: currDate,
        updatedAt: currDate,
      }
      this.eventTitle = ""
      await this.$fire.firestore.collection('events').add(data)
      .then((docRef) => {
        
        this.events.unshift({
          id: docRef.id,
          ...data,
          startDateTime: "N/A",
          endDateTime: "N/A",
          updatedDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss')
        })
       
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    },
    async validateSubmit () {
      let isvalid = this.$refs.form.validate()

      if (isvalid) {
        try{
          await this.createNewEvent().then(()=>{
  
            this.success = "Successfully updated!!"
            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          this.error = "Could not set user information"
        }
      }
      this.$refs.form.validate()
    }
  }
}
</script>
