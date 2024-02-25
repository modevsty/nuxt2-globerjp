<template>
  <v-container>
    <!-- <v-alert style="position:fixed;left: 50%;
  z-index:30000;
  width: fit-content;
  bottom: 50px;
  transform: translate(-50%, -50%);
  margin: 0 0 auto; " type="success" :value="!!success">{{ success }}</v-alert>
      <v-alert style="position:fixed;left: 50%;
  z-index:30000;
  width: fit-content;
  bottom: 50px;
  transform: translate(-50%, -50%);
  margin: 0 0 auto; " type="error" :value="!!error">{{ error }}</v-alert> -->
  <v-dialog
    v-model="newInfoDialog"
    offset-y
    persistent
    style="float:right;"
    max-width="min(100%,800px)"
    scrollable
  >
          
    <!-- <template v-slot:activator="{ on }">
      <v-row>
        <v-col class="pb-0">
          <v-btn @click="fillForm" style="float:right" color="primary" dark v-on="on">
            <v-icon small>
              mdi-pencil
            </v-icon>
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </template> -->
    <v-card style="height:fit-content">
      <v-card-title>
        <span style="word-break:break-word" class="headline">
          Update Profile Info
        </span>
      </v-card-title>
      <v-form
        ref="form"
        class="pa-4 pt-0"
        v-model="valid"
        lazy-validation
      >
        <v-container style="max-width:min(100%,800px)">
          <v-row>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                v-model="tempForm.firstName"
                :rules="firstNameRules"
                label="First Name"
                required
              ></v-text-field>
            </v-col>

            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                v-model="tempForm.lastName"
                :rules="lastNameRules"
                label="Last Name"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                v-model="tempForm.nickName"
                label="Nick Name"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                v-model="tempForm.email"
                disabled
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-select
                v-if="isMobileScreen"
                v-model="tempForm.country"
                :rules="[v => !!v || 'Country is required']"
                :items="countries"
                required
                label="Country"
              ></v-select>
              <v-autocomplete
                v-else
                :menu-props="{closeOnClick:true}"
                v-model="tempForm.country"
                :rules="[v => !!v || 'Country is required']"
                :items="countries"
                required
                label="Country"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                required
                :rules="[v => !!v || 'University is required']"
                v-model="tempForm.university"
                label="University"
              ></v-text-field>
            </v-col> -->
            <v-col class="pt-6 pt-md-4 pb-6 pb-md-4" style="position:relative" v-if="universityFound" cols="12" md="6" sm="12">
              <p class="treeselect-title">University</p>
              <treeselect v-model="tempForm.university" 
                :required="true"
                :clearable="!isMobileScreen"
                :searchable="!isMobileScreen"
                :disable-branch-nodes="true"
                :show-count="true"
                placeholder="Select University..." 
                :max-height="200"
                :options="universitiesTree" />
            </v-col>
            <v-col v-if="!universityFound" class="py-1" cols="10" md="5">
              <v-text-field
                required
                :rules="[v => !!v || 'University is required']"
                v-model="tempForm.university"
                label="University"
              ></v-text-field>
            </v-col>
            <v-col v-if="!universityFound" class="py-1" cols="2" md="1">
                <v-checkbox
                :on-icon="'mdi-dots-horizontal'"
                :off-icon="'mdi-dots-horizontal'"
                style="float:right;"
                v-model="universityFound"
                >
                </v-checkbox>
            </v-col>

            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-select
                required
                :rules="[v => !!v || 'Degree is required']"
                v-model="tempForm.degree"
                :items="degrees"
                label="Pursuing Degree"
              ></v-select>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-select
                required
                :rules="[v => !!v || 'Expected Graduation Year is required']"
                v-model="tempForm.expectedGraduationYear"
                :items="expectedGraduationYears"
                label="Expected Year of Graduation"
              ></v-select>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-text-field
                required
                :rules="[v => !!v || 'Major is required']"
                v-model="tempForm.major"
                label="Major"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-menu
                v-model="menuDateOfEntry"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="
                      tempForm.dateOfEntry
                    " 
                    :rules="[v => !!v || 'Date of Entry into Japan is required' ]"
                    label="Date of Entry into Japan"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="
                    tempForm.dateOfEntry
                  "
                  type="month"
                  @input="
                    menuDateOfEntry = false;
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-select
                v-model="tempForm.interests"
                :items="majors"
                :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached}"
                label="Interests"
                v-on:input="limiter"
                multiple
                clearable
                hint="Select upto 5 interests"
                persistent-hint>
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                  <span
                    v-if="index === selectMaxDisplay"
                    class="grey--text caption"
                  >(+{{ tempForm.interests.length - selectMaxDisplay }} interests)</span>
                </template>
              </v-select>

            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="$nuxt.$emit('closeDialog', 'true')">
                  Cancel</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="
                    () => {
                      validateSubmit();
                    }
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-col>
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
    </v-card>
  </v-dialog>
  </v-container>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import fixtures from "@/fixtures/fixtures.json"
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
    components: {Treeselect},
    props: [
      'newInfoDialog',
      'success',
      'error'
    ],
    data() {
    return {
      universityFound: true,
      valid: true,
      pageLoaded: false,
      tempForm: {},
      firstName: "",
      nickName: "",
      lastName: "",
      email: "",
      country: "",
      university: "",
      degree: "",
      major: "",
      interests: [],
      dateOfEntry: "",
      expectedGraduationYear: "",
      selectMaxDisplay: 1,
      expectedGraduationYears: (function() {
          let year = new Date().getFullYear();
          return Array.from({length: 12}, (_, i) => i + year)}
        )(),
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      firstNameRules: [
        v => !!v && !!v.replace(/\s/g, '').length || 'First Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      lastNameRules: [
        v => !!v || 'Last Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      countries: fixtures.countries,
      degrees: fixtures.degrees,
      universities: fixtures.universities,
      universitySet: new Set(fixtures.universities),
      majors: fixtures.majors,
      selectedEvent: {},
      eventImages: null,
      FULL_IMAGE: {
        maxDimension: 1280,
        quality: 0.9
      },
      THUMB_IMAGE: {
        maxDimension: 640,
        quality: 0.7
      },
      menuDateOfEntry: false,
    };
  },
  computed: {
    universitiesTree() {
      const universitiesTree = {}
      const alphabets = [...Array(26)].map((_, i) => String.fromCharCode(i + (65)));
      alphabets.forEach(e => {
        universitiesTree[e] = {
          id : e,
          label: e,
          children: []
        }
      })
      this.universities.forEach(e => {
        universitiesTree[e[0]].children.push({
          id: e,
          label: e
        })
      })
      const universitiesArray = Object.values(universitiesTree)
      universitiesArray.push({
        id: 'other',
        label: 'other'
      })
      return universitiesArray
    },
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 800) ? false : true 
      }
      return true
    },
    limitReached() {
      
      if(this.tempForm && this.tempForm.interests && this.tempForm.interests.length == 5) {
        return true
      }
      return false
    },
    user() {
      return this.$store.state.authUser
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
  },
  // created() {
  //   // await this.getInfo();
  //   this.fillForm();
  // },
  watch: {
    tempForm: {
      deep: true,
      handler(val) {
        if (val.university === 'other') {
          this.universityFound = false
          this.tempForm.university = ""
        }
      }
    },
    universityFound(val) {
      if (val) {
         this.tempForm.university = null
      }
    },
    newInfoDialog() {
      this.fillForm();
    },
  },
  methods: {
    fillForm() {
      if (this.university && !this.universitySet.has(this.account.university)) {
        this.universityFound = false
      }
      this.tempForm = {
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        nickName: this.account.nickName,
        email: this.account.email,
        country: this.account.country,
        university: this.account.university? this.account.university : null,
        degree: this.account.degree,
        major: this.account.major,
        interests: this.account.interests,
        dateOfEntry: this.account.dateOfEntry,
        expectedGraduationYear: this.account.expectedGraduationYear,
      }
    },
    fillFromForm() {
      this.firstName = this.tempForm.firstName;
      this.lastName = this.tempForm.lastName;
      this.nickName = this.tempForm.nickName;
      this.email = this.tempForm.email;
      this.country = this.tempForm.country;
      this.dateOfEntry = this.tempForm.dateOfEntry;
      this.expectedGraduationYear = this.tempForm.expectedGraduationYear;
      this.major = this.tempForm.major;
      this.interests = this.tempForm.interests;
      this.university = this.tempForm.university;
      this.degree = this.tempForm.degree;
    },

    limiter(e) {
      if(e.length > 5) {
        e.pop()
      }
    },
    // fetchServiceUrl(url) {
    // },
    ...mapActions({
      fetchAccount: 'account/FETCH_ACCOUNT'
    }),
    ...mapMutations({
      setAccount: 'account/SET_ACCOUNT'
    }),
    async validateSubmit () {
      let isvalid = this.$refs.form.validate()
      if (this.universityFound && !this.tempForm.university) {
        this.universityFound = false
        this.$forceUpdate()
        this.$nextTick(()=> {
          this.$refs.form.validate()
          alert("University field must not be empty.")
        })
        
        return
      }
      const currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
            ...this.tempForm,
            createdAt: this.account.createdAt || currDate,
            updatedAt: currDate
          }
          await this.$fire.firestore.collection("users").doc(this.user.uid).update(data).then(()=>{
            this.fillFromForm()
            this.setAccount(data)
            $nuxt.$emit('success', "Successfully updated!!");
            // const uid = this.$parent._uid
            // this.$parent.$parent.$children.forEach(e => {
            //   if (uid !== e._uid) {
            //     e.$destroy()
            //   }
            // })
          })
        } catch(error) {
          $nuxt.$emit('error', "Could not set user information");
        }
        $nuxt.$emit('closeDialog');
      }
      this.$refs.form.validate()
    },
    // async asyncData({ store, $fire }) {
    //   return {
    //     firstName: this.account.first
    //   }
    //   const post = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
    //   return { post }
    // }

    // async getInfo() {
    //   const account = this.account;
    //   this.firstName = account.firstName;
    //   this.lastName = account.lastName;
    //   this.email = account.email;
    //   this.country = account.country;
    //   this.dateOfEntry = account.dateOfEntry;
    //   this.expectedGraduationYear = account.expectedGraduationYear;
    //   this.major = account.major;
    //   this.interests = account.interests;
    //   this.university = account.university;
    //   this.degree = account.degree;
    // },

  }
}
</script>
<style lang="scss">
.vue-treeselect__option-arrow-placeholder {
  @media screen and (max-width: 800px) {
    display: none;
  }
}
.v-autocomplete__content {
  max-height: 46vh !important;
}
</style>
<style lang="scss" scoped>
.treeselect-title {
  left: 5px; 
  top: 18px; 
  right: auto; 
  position: absolute; 
  color: rgba(0, 0, 0, 0.6);
  transform: translateY(-18px) scale(0.75);
  @media screen and (min-width: 960px) {
    top: 10px; 
  }
}
</style>
