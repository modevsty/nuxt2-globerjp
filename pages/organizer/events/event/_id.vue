<template>
  <div>
    <Spinner color="white" v-if="!user"></Spinner>
    <v-container v-else>
      <v-row v-if="!isOrganizer">
        You are not an organizer.
        Go to&nbsp;<NuxtLink class="primary--text" to="/dashboard">
          your page
        </NuxtLink>
      </v-row>
      <div v-else>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
          <div v-else>
          <v-card>
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
            <v-form ref="eventform" v-model="valid" lazy-validation>
              <v-container>
                <v-card-title style="padding-left:0">
                    Edit Event
                </v-card-title>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="event.title"
                      label="Title"
                    />
                  </v-col>
                  <v-col cols="12">
                    <editor v-model="event.description" />
                  <!-- <v-textarea
                    v-model="event.description"
                    :rules="rules.veryLongDescriptionRule"
                    label="Description"
                    rows="9"
                    :counter="1000"
                  /> -->
                  </v-col>
                  <v-col cols="12" md="4">
                  <v-checkbox
                    v-model="event.isOnline"
                    :label="`Is Online: ${event.isOnline.toString()}`"
                  ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="8">
                  <v-text-field
                      v-if="!event.isOnline"
                      v-model="event.location"
                      label="Location"
                    />
                  </v-col>

                  <v-col cols="6" md="6">
                    <v-menu
                      v-model="menuEventDateFrom"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.eventDateFrom
                          "
                          class="pt-0"
                          :rules="rules.required"
                          label="Event Start Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="
                          event.eventDateFrom
                        "
                        
                        @input="
                          menuEventDateFrom = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="6" md="6">
                    <v-menu
                      v-model="menuEventTimeFrom"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.eventTimeFrom
                          "
                          :rules="rules.required"
                          class="pt-0"
                          label="Event Start Time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="
                          event.eventTimeFrom
                        "
                        
                        @input="
                          menuEventTimeFromT = false;
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="6" md="6">
                    <v-menu
                      v-model="menuEventDateTo"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.eventDateTo
                          "
                          :rules="rules.required"
                          class="pt-0"
                          label="Event End Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="
                          event.eventDateTo
                        "
                       
                        @input="
                          menuEventDateTo = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  
                  <v-col cols="6" md="6">
                    <v-menu
                      v-model="menuEventTimeTo"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.eventTimeTo
                          "
                          :rules="rules.required"
                          class="pt-0"
                          label="Event End Time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="
                          event.eventTimeTo
                        "
                        
                        @input="
                          menuEventTimeToT = false;
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>


                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-checkbox
                          v-model="event.hasDeadline"
                          @change="checkDeadline()"
                          :label="`Event has deadline? ${event.hasDeadline.toString()}`"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col v-if="event.hasDeadline" cols="6" md="6">
                    <v-menu
                      v-model="menuDeadlineDate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.deadlineDate
                          "
                          class="pt-0"
                          label="Event Deadline Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="
                          event.deadlineDate
                        "
                       
                        @input="
                          menuDeadlineDate = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col v-if="event.hasDeadline" cols="6" md="6">
                    <v-menu
                      v-model="menuDeadlineTime"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            event.deadlineTime
                          "
                          class="pt-0"
                          label="Event Deadline Time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="
                          event.deadlineTime
                        "
                        
                        @input="
                          menuDeadlineTimeT = false;
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <v-checkbox
                          v-model="event.hasAttendeeLimit"
                          :label="`Has attendee limit? ${event.hasAttendeeLimit.toString()}`"
                        ></v-checkbox>
                      </v-col>
                      <v-col v-if="event.hasAttendeeLimit" cols="6">
                        <v-text-field
                          v-model.number="event.attendeeLimit"
                          type="number"
                          >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" class="col-sm-6">
                        <v-checkbox
                          v-model="event.hasUniversityCondition"
                          :label="`Has university condition? ${event.hasUniversityCondition.toString()}`"
                        ></v-checkbox>
                      </v-col>
                      <v-col v-if="event.hasUniversityCondition" cols="12" class="col-sm-6">
                        <v-autocomplete
                          v-model="event.universityCondition"
                          :items="universities"
                          item-text="title"
                          return-object
                          multiple
                          :menu-props="{closeOnClick:true}"
                          label="Select Universities"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="12">
                  <v-checkbox
                    v-if="event.isApproved"
                    v-model="event.isRequested"
                    :label="`Approval received. Publish this event: ${event.isRequested.toString()}`"
                  ></v-checkbox>
                  <v-checkbox
                    v-else
                    v-model="event.isRequested"
                    :label="`No Approval yet. Request to publish this event: ${event.isRequested.toString()}`"
                  ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-checkbox
                    disabled
                    v-model="event.isPublished"
                    :label="`Is Event Published? ${event.isPublished.toString()}`"
                  ></v-checkbox>
                  </v-col>
                  
                  <v-col cols="6" md="6">

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
                            <!-- <v-btn style="float:right" color="primary" dark v-on="on">
                              <v-icon small>
                                mdi-pencil
                              </v-icon>
                              Edit
                            </v-btn> -->
                            <v-btn
                              :disabled="!valid"
                              color="blue accent--text"
                              class="mr-4"
                              v-on="on"
                            >
                              Save
                            </v-btn>
                          </v-col>
                        </v-row>
                      </template>
                      <v-card style="height:fit-content">
                        <v-card-title class="pb-0">
                          <v-form
                            ref="bioform"
                            class="pt-30"
                            v-model="valid"
                            lazy-validation
                          >
                            <v-container>
                              <v-row>
                                <v-col v-if="event.isApproved" cols="12">
                                  <span style="word-break: break-word;"
                                  > Would you like to publish this event?</span>
                                </v-col>
                                <v-col v-else cols="12">
                                  <span style="word-break: break-word;"
                                  > Would you like to request to publish this event?</span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-title>
                        <v-card-actions class="d-flex flex-wrap align-center justify-center">
                          <v-spacer style="margin-bottom: 50px;"></v-spacer>
                          <v-btn color="primary" :disabled="!valid" text @click="() => {validateSubmit();newInfoDialog = false}">
                            Only Save</v-btn
                          >
                          <v-btn
                            v-if="event.isApproved"
                            color="primary"
                            :disabled="!valid"
                            @click="
                              () => {
                                publishValidateSubmit();
                                newInfoDialog = false;
                              }
                            "
                          >
                            Save & Publish
                          </v-btn>
                          <v-btn
                            v-else
                            color="primary"
                            :disabled="!valid"
                            @click="
                              () => {
                                publishValidateSubmit();
                                newInfoDialog = false;
                              }
                            "
                          >
                            Save & Request to Publish
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col cols="6" md="6"  class="d-flex justify-end justify-end">
                    <v-btn
                      class="error text-white float-lg-right"
                      @click="confirmDelete"
                    >
                      Delete
                    </v-btn>
                  </v-col> 
                </v-row>
              </v-container>
            </v-form>
          </v-card>
          <v-card class="mt-5">
            <v-card-title>
              Event Photos
            </v-card-title>
            <v-card-text>
                <v-row>
                  <v-col class="d-flex justify-center align-center" v-for="(_, index) in event.images" :key="index">
                    <v-card style="width: fit-content; max-width: 100%;margin-bottom: 40px; position: relative">
                      <v-icon
                        role="button"
                        class="close-button"
                        @click="removeImage(index)"
                        >mdi-close</v-icon
                      >
                      <v-card-text>
                        <span>
                          <!-- <v-textarea
                            v-model="event.images[index]"
                            :error-messages="
                              getErrorMessages('job Description-' + (index + 1))
                            "
                            :rules="imagesRule"
                            :counter="200"
                            :label="'仕事内容-' + (index + 1)"
                            @change="onChangeValue('jobDescriptions')"
                          >
                          </v-textarea> -->
                          <div class="mb-4">
                            <label>Imageー{{ index + 1 }}</label>
                            <br />
                            <div
                              v-if="
                                event.images[index] &&
                                  event.images[index].teaserImageUrl
                              "
                            >
                              <img
                                :src="imgFailed? '/img/image-not-found.png':event.images[index].teaserImageUrl"
                                @error="imgFailed=true"
                                style="max-width: 100%;width:260px; height: auto; object: cover; object-fit: cover; display: inline:block;"
                                alt=""
                              />
                              <!-- <button
                                v-if="event.images[index].imageUrl"
                                class="button-style"
                                :disabled="isDeletingImage[index]"
                                type="button"
                                style="background-color: red;border-color: red; color: white;"
                                @click="deleteImage(index)"
                              >
                                {{ isDeletingImage[index] ? 'Deleting...' : 'Delete' }}
                              </button> -->
                            </div>
                            <button
                              v-if="!event.images[index].teaserImageUrl"
                              class="button-style"
                              :disabled="isUploadingImage[index]"
                              type="button"
                              @click="launchImageFile(index)"
                            >
                              {{ isUploadingImage[index] ? 'Uploading...' : 'Upload' }}
                            </button>
                            <input
                              style="word-break: break-word; text-wrap: normal"
                              :ref="`imageFile${index}`"
                              type="file"
                              accept="image/png, image/jpeg"
                              class="hidden"
                              @change.prevent="
                                uploadImageFile($event.target.files, index)
                              "
                            />
                          </div>
                        </span>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
            </v-card-text>
            <v-btn block @click="addImage">
              <v-icon>mdi-plus-circle</v-icon>
              Add Image
            </v-btn>
          </v-card>
          <v-card class="mt-5">
            <v-card-title>
              Custom Form
            </v-card-title>
            <CustomForm v-model="formSchema" />
            <v-row>
              <v-col>
                <v-btn color="blue accent--text ma-3" @click="saveCustomForm">Save Form</v-btn>
              </v-col>
            </v-row>
          </v-card>
          <!-- <v-card class="mt-5">
            <input style="display:none;" id="myInput" v-model="emailList" />
            <v-btn style="float:right; margin:5px;" @click="copyEmail">Copy Emails</v-btn>
            <v-card-text>
              <h2>{{"Attendees" + " (" + attendees.length + ")"}}</h2>
              <v-list v-if="attendees.length">
                <v-list-item class="d-flex flex-column justify-space-between" v-for="attendant of attendees" :key="attendant.id"
                  >
                  <div class="d-flex flex-row justify-space-between align-center" style="width: 100%">
                    <v-list-item-avatar
                      ><v-icon>mdi-account</v-icon></v-list-item-avatar
                    ><v-list-item-title>{{
                      attendant.firstName + " " + attendant.lastName
                    }}</v-list-item-title>
                    <v-list-item-title style="text-align: end"
                      >{{attendant.email}}</v-list-item-title
                    >
                  </div>
                  <div v-if="userIdtoEntryDict[attendant.id].customFormValues" class="d-flex flex-column" style="width: 100%; text-align: right;">
                    <v-list-item-subtitle  style="width: 100%;" v-for="(value, key, index) in userIdtoEntryDict[attendant.id].customFormValues" :key="index">
                      {{`${userIdtoEntryDict[attendant.id].customFormElementNameToObjDict[key].label}:${value}`}}
                    </v-list-item-subtitle>
                  </div>
                </v-list-item>
              </v-list>
              <p v-else>Nobody has registered yet!</p>
            </v-card-text> 
          </v-card> -->
          <UserList :event="event" :attendees="attendees" :userIdtoEntryDict="userIdtoEntryDict" :schema="event.formSchema" class="mt-5 mb-5"/>
          </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import fixtures from "@/fixtures/fixtures.json"
import CustomForm from '@/components/CustomForm';
import Spinner from '@/components/LoadingSpinner'
import Editor from '@/components/Editor';
import UserList from '@/components/UserList';
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner, Editor, CustomForm, UserList },
  layout: "default",
  name: "organizer",
  data() {
    return {
      universities: fixtures.universities,
      imgFailed: false,
      valid: false,
      success: null,
      error: null,
      rules: {
        required: [value => !!value || 'Required Field'],
        veryLongDescriptionRule: [
          (v) => {
            if (!v) {
              return true;
            }
            return (
              v.length <= 2000 || 'Description must be less than 1000 characters'
            );
          }
        ],
      },
      FULL_IMAGE: {
        maxDimension: 1280,
        quality: 0.9
      },
      THUMB_IMAGE: {
        maxDimension: 640,
        quality: 0.7
      },
      menuDeadlineDate: false,
      menuDeadlineTime: false,
      menuEventDateFrom: false,
      menuEventDateTo: false,
      menuEventTimeFrom: false,
      menuEventTimeTo: false,
      newInfoDialog: false
    }
  },
  ...mapActions({
    fetchAccount: 'account/FETCH_ACCOUNT'
  }),
  ...mapMutations({
    setAccount: 'account/SET_ACCOUNT'
  }),
  async asyncData({store, $fire, $moment, route}) {
  
    let res = await $fire.firestore.collection('events')
    .doc(route.params.id)
    .get()
    let pageLoaded = false
    let event = {
      id: "ID",
      title: "",
      description: "",
      location: "",
      isOnline: false,
      isPublished: false,
      isApproved: false,
      isRequested: false,
      creatorId: "ID",
      isCreatorOrganizer: true,
      eventDateFrom: "",
      eventDateTo: "",
      eventTimeFrom: "",
      eventTimeTo: "",
      hasDeadline: false,
      deadlineDate: "",
      deadlineTime: "",
      hasAttendeeLimit: false,
      hasUniversityCondition: false,
      universityCondition: [],
      attendeeLimit: 0,
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
      requestedAt: "",
      images: [],
      formSchema: []
    }
    let customFormValuesDict = {}
    if (res.exists) {
      pageLoaded = true;
      let data = res.data();
      event = {
        ...event,
        ...data,
        id: res.id,
      }
    }

    if (!event.isCreatorOrganizer && event.creatorId !== store.state.authUser.uid) {
      $nuxt.error({ statusCode: 404, message: 'Wrong event access' })
      return
    }


    let entries = await $fire.firestore.collection('entries').where("eventId","==",route.params.id)
    .get()
    .then((querySnapshot) => {
      let out = []
      querySnapshot.forEach((doc) => {
        let id = doc.id
        let data = doc.data()
        out.push({
          id,
          ...data,
        })
      })
      return out
    })

    let userIdtoEntryDict = {};
    entries.forEach(e=>{
      userIdtoEntryDict[e.userId] = e
    })

    let promises = []
    for (let entry of entries) {
      promises.push($fire.firestore.collection('users').doc(entry.userId).get())
    }
    let attendees = await Promise.all(promises).then((querySnapshot) => {
      let out = []
      querySnapshot.forEach(res => {
        let id = res.id
        let data = res.data()
        if (res && id && data) {
          out.push({
            id,
            ...data
          })
        }
      })
      return out
    })
    
    
    return {
      formSchema: event.formSchema,
      entries,
      event,
      pageLoaded,
      attendees,
      userIdtoEntryDict
    }
    
  },
  // watch: {
  //   formSchema: {
  //     handler(val) {
  //       this.saveCustomForm(val);
  //     }
  //   }
  // },
  computed: {
    emailList() {
      if (!this.attendees) return ''
      return this.attendees.map(e=>{return e.email}).join(', ')
    },
    user() {
      return this.$store.state.authUser
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    ...mapGetters({
      isOrganizer: "account/ISORGANIZER",
    }),
    isDeletingImage() {
      if (!this.event) return [];
      const isDeletingImage = this.event.images.map((_) => false);
      return isDeletingImage;
    },
    isUploadingImage() {
      if (!this.event) return [];
      const isUploadingImage = this.event.images.map((_) => false);
      return isUploadingImage;
    },
  },
  methods: {
    async confirmDelete () {
      this.pageLoaded = false
      // eslint-disable-next-line no-alert
      const result = window.confirm('Are you sure you want to delete this event?')
      if (result) {
        if (this.event.images) {
          for(let i = this.event.images.length - 1; i >= 0; i--) {
            await this.deleteImage(i)
          }
        }

        const promise = this.$fire.firestore.collection('events').doc(this.event.id).delete()

        Promise.all([promise])
          .then(() => {
            // eslint-disable-next-line no-alert
            alert('Event deleted!')
            this.$router.push({
              path: '/organizer/events'
            })
            return null
          })
          .catch((error) => {
            // eslint-disable-next-line no-alert
            alert('Unable to delete event!')
            this.pageLoaded = true
            // eslint-disable-next-line no-console
            console.error(error)
          })
      } else {
        this.pageLoaded = true
      }
    },
    async saveCustomForm() {
      try{
        let currDate = Date.now().toString()
        let data = {
          updatedAt: Date.now().toString(),
          publishedAt: this.event.isPublished? currDate: this.event.publishedAt,
          requestedAt: this.event.isRequested? currDate: this.event.requestedAt,
          formSchema: this.formSchema
        }

        await this.$fire.firestore.collection("events").doc(this.event.id).update(data).then(()=>{

          this.success = "Successfully added custom form!!"
          setTimeout(()=>{
            this.success = null
          },2000)
        })
      } catch(error) {
        console.log(error)
        this.error = "Could not set custom form"
      }
    },
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
    checkDeadline() {
      if (!this.event.hasDeadline) {
        this.event.deadlineDate = ""
        this.event.deadlineTime = ""
      }
    },
    async publishValidateSubmit() {
      this.event.isRequested = true;
      await this.validateSubmit();
    },
    async validateSubmit () {
      let isvalid = this.$refs.eventform.validate()
      const dateFrom = Date.parse(this.event.eventDateFrom + "T" + this.event.eventTimeFrom)
      const dateTo = Date.parse(this.event.eventDateTo + "T" + this.event.eventTimeTo)
      if (dateFrom > dateTo) {
        this.error = "Event end date cannot be before event start date."
        setTimeout(()=>{
          this.error = null
        },15000)
        return
      }
      let currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
            title: this.event.title,
            description: this.event.description,
            location: this.event.location,
            isOnline: this.event.isOnline,
            isPublished: (this.event.isRequested && this.event.isApproved),
            eventDateFrom: this.event.eventDateFrom,
            eventDateTo: this.event.eventDateTo,
            eventTimeFrom: this.event.eventTimeFrom,
            eventTimeTo: this.event.eventTimeTo,
            hasDeadline: this.event.hasDeadline,
            deadlineDate: this.event.deadlineDate,
            deadlineTime: this.event.deadlineTime,
            hasAttendeeLimit: this.event.hasAttendeeLimit,
            attendeeLimit: this.event.attendeeLimit,
            hasUniversityCondition: this.event.hasUniversityCondition,
            universityCondition: this.event.universityCondition,
            createdAt: this.event.createdAt,
            publishedAt: (this.event.isRequested && this.event.isApproved)? currDate : this.event.publishedAt,
            requestedAt: this.event.isRequested? currDate: this.event.requestedAt,
            isApproved: this.event.isApproved,
            isRequested: this.event.isRequested,
            updatedAt: currDate,
            isCreatorOrganizer: true
          }
 
          await this.$fire.firestore.collection("events").doc(this.event.id).update(data).then(()=>{
            this.event.isPublished = this.event.isRequested && this.event.isApproved
            this.success = "Successfully updated!!"
            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          console.log(error)
          this.error = "Could not set user information"
        }
      }
      this.$refs.eventform.validate()
    },
    async deleteImage(index) {
      this.isDeletingImage[index] = true;

      const fullImageDeletePromise = this.$fire.storage
        .refFromURL(this.event.images[index].imageUrl)
        .delete();
      const thumbImageDeletePromise = this.$fire.storage
        .refFromURL(this.event.images[index].teaserImageUrl)
        .delete();

      return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
        .then(async () => {
          this.event.images[index].imageUrl = '';
          this.event.images[index].teaserImageUrl = '';
          await this.updateImageFirestore();
          return null;
        })
        .catch(async (error) => {
          // eslint-disable-next-line no-console
          console.error('Error deleting image', error);

          if (error.code === 'storage/object-not-found') {
            this.event.images[index].imageUrl = '';
            this.event.images[index].teaserImageUrl = '';
            await this.updateImageFirestore();
          }
        })
        .finally(() => {
          this.isDeletingImage[index] = false;
        });
    },
    launchImageFile(index) {
      const file = `imageFile${index}`;
      this.$refs[file][0].click();
    },
    async uploadImageFile(files, index) {
      if (!files.length) {
        return;
      }
      const file = files[0];

      if (!file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image.');
        return;
      }

      const metadata = {
        contentType: file.type
      };

      const fullImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.FULL_IMAGE.maxDimension,
          this.FULL_IMAGE.quality,
          resolve
        );
      });

      const thumbImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.THUMB_IMAGE.maxDimension,
          this.THUMB_IMAGE.quality,
          resolve
        );
      });

      const images = await Promise.all([
        fullImageResizePromise,
        thumbImageResizePromise
      ]);

      const date = Date.now().toString()

      const fullImageUploadPromise = this.uploadSingleImageFile(
        date + "_" +file.name,
        images[0],
        metadata
      );

      const thumbFileName =
        date + "_" +
        file.name.substring(0, file.name.lastIndexOf('.')) +
        '_thumb.' +
        file.name.substring(file.name.lastIndexOf('.') + 1);
      const thumbImageUploadPromise = this.uploadSingleImageFile(
        thumbFileName,
        images[1],
        metadata
      );
      if (this.event.images[index].imageUrl !== "") {
        await this.deleteImage(index).catch((err) => {
          console.log(err)
          return
        })
      }

      this.isUploadingImage[index] = true;

      await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
        .then(async (results) => {
          this.event.images[index].imageUrl = results[0];
          this.event.images[index].teaserImageUrl = results[1];
          await this.updateImageFirestore();
        })
        .finally(() => {
          this.isUploadingImage[index] = false;
        });
    },
    uploadSingleImageFile(filename, blob, metadata) {
      const storage = this.$fire.storage;
      const imageRef = storage.ref(`images/${this.event.id}/${filename}`);

      return imageRef
        .put(blob, metadata)
        .then(snapshot => {
          // eslint-disable-next-line promise/no-nesting
          return snapshot.ref.getDownloadURL().then(url => {
            return url;
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error uploading image', error);
        });
    },
    generateVariation(file, maxDimension, quality, cb) {
      const displayPicture = (url) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          const canvas = this.getScaledCanvas(image, maxDimension);
          canvas.toBlob(cb, 'image/jpeg', quality);
        };
      };

      const reader = new FileReader();
      reader.onload = e => displayPicture(e.target.result);
      reader.readAsDataURL(file);
    },
    getScaledCanvas(image, maxDimension) {
      const scaledCanvas = document.createElement('canvas');

      if (image.width > maxDimension || image.height > maxDimension) {
        if (image.width > image.height) {
          scaledCanvas.width = maxDimension;
          scaledCanvas.height = (maxDimension * image.height) / image.width;
        } else {
          scaledCanvas.width = (maxDimension * image.width) / image.height;
          scaledCanvas.height = maxDimension;
        }
      } else {
        scaledCanvas.width = image.width;
        scaledCanvas.height = image.height;
      }
      scaledCanvas
        .getContext('2d')
        .drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          scaledCanvas.width,
          scaledCanvas.height
        );
      return scaledCanvas;
    },
    addImage() {
      this.event.images.push({ imageUrl: '', teaserImageUrl: '' });
      // await this.updateImageFirestore();
    },
    async removeImage(index) {
      const confirmation = window.confirm('Are you sure?');
      // console.log(confirmation);

      if (!confirmation) return;
      if (this.event.images[index].imageUrl !== '') {
        await this.deleteImage(index);
        this.event.images.splice(index, 1);
        await this.updateImageFirestore();
      } else {
        this.event.images.splice(index, 1);
      }

      // this.qualifications.forEach((qualification, index) => {
      //   qualification.id = index;
      // });
    },
    async updateImageFirestore() {
      try{
          let data = {
            updatedAt: Date.now().toString(),
            publishedAt: this.event.isPublished? Date.now().toString():this.event.publishedAt,
            images: this.event.images
          }
          await this.$fire.firestore.collection("events").doc(this.event.id).update(data).then(()=>{
            this.success = "Successfully updated!!"
            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          console.log(error)
          this.error = "Could not set user information"
        }
    }
  }
}
</script>
