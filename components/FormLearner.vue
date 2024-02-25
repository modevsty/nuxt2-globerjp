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
    max-width="min(100%,950px)"
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
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step
            :editable="e1 > 1"
            :complete="e1 > 1"
            step="1"
          >
            Basic Information
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :editable="true"
            :complete="e1 > 2"
            step="2"
          >
            Language Information
          </v-stepper-step>

          <!-- <v-divider></v-divider>

          <v-stepper-step step="3">
            Name of step 3
          </v-stepper-step> -->
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form
              ref="basicform"
              class="pa-4 pt-0"
              v-model="validBasic"
              lazy-validation
            >
              <v-container style="max-width:min(100%,950px)">
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
                      <!-- <v-btn color="primary" text @click="$nuxt.$emit('closeDialog', 'true')">
                        Cancel</v-btn
                      > -->
                      <!-- <v-btn
                        color="primary"
                        :disabled="!valid"
                        @click="
                          () => {
                            validateSubmit();
                          }
                        "
                      >
                        Save
                      </v-btn> -->
                      <v-btn
                        color="primary"
                        @click="
                          () => {
                            validateBasicForm();
                          }
                        "
                      >
                        Continue
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
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form
              ref="languageform"
              class="pa-4 pt-0"
              lazy-validation
            >
              <v-container style="max-width:min(100%,800px)">
                <v-row>
                  <v-col class="py-1" cols="12" md="6" sm="12">
                    <v-textarea
                      v-model="tempForm.bio"
                      placeholder="say something about yourself..."
                      rows="6"
                      :rules="[v=> !!v && v.length < 200 || 'Must be less than 200 characters.']"
                      label="About me"
                    ></v-textarea>
                  </v-col>

                  <v-col class="pb-1 " cols="12" md="6" sm="12">
                    <v-menu
                      v-model="menuBirthDate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="
                            tempForm.birthDate
                          "
                          class="pt-0 pb-5"
                          :rules="required"
                          label="Birth Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="
                          tempForm.birthDate
                        "
                        
                        @input="
                          menuBirthDate = false;
                        "
                      ></v-date-picker>
                    </v-menu>
                    <v-select
                      :items="genders"
                      label="Gender"
                      v-model="tempForm.gender"
                      item-text="text"
                      item-value="value"
                      dense
                    ></v-select>
                    <v-checkbox
                      v-model="tempForm.availability"
                      :label="`Available to be contacted? ${tempForm.availability && tempForm.availability? 'Yes' : 'No' || 'No'}`"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="py-1" cols="12" md="6" sm="12">
                    <v-select
                      v-model="tempForm.knows"
                      @change="updateLanguageLevel"
                      :items="languages"
                      :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached}"
                      label="Languages I know"
                      v-on:input="limiter"
                                            :rules="[(v) => v.length>0 || 'At least one language is required']"
                      multiple
                      clearable
                      hint="Select upto 5 languages"
                      persistent-hint>
                      <!-- <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                        <span
                          v-if="index === selectMaxDisplay"
                          class="grey--text caption"
                        >{{ tempForm.knows && tempform.knows.length? '(' + tempForm.knows.length - selectMaxDisplay + 'languages)': '' }} 
                        </span>
                      </template> -->
                    </v-select>
                  </v-col>

                  <v-col class="py-1" cols="12" md="6">
                    <v-select
                      v-model="tempForm.learning"
                      @change="updateLanguageLevel"
                      :items="languages"
                      :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached}"
                      label="Languages I want to learn"
                      v-on:input="limiter"
                      :rules="[(v) => v.length>0 || 'At least one language is required']"
                      multiple
                      clearable
                      hint="Select upto 5 languages"
                      persistent-hint>
                      <!-- <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                        <span
                          v-if="index === selectMaxDisplay"
                          class="grey--text caption"
                        >{{ tempForm.knows && tempform.knows.length? '(' + tempForm.knows.length - selectMaxDisplay + 'languages)': '' }} 
                        </span>
                      </template> -->
                    </v-select>

                  </v-col>
                  <v-col class="pt-5" v-if="tempForm.knows || tempForm.learning" cols="12">
                    <v-row>
                      <v-col 
                      v-for="language of combinedLanguages" 
                      :key="language" cols="12" md="6">
                        <!-- <v-subheader> {{ language }}</v-subheader> -->
                          <v-slider
                            :label="language"
                            v-model="tempForm.languageLevel[language]"
                            @change="e=>setTickLabelsArray(language, e)"
                            :tick-labels="tickLabelsArray[language]"
                            :max="3"
                            step="1"
                            ticks="always"
                            tick-size="4"
                          ></v-slider>
                          <!-- <div style="color:#000;font-size:18px;">{{ profile.knows[language] }}</div> -->
                      </v-col>
                      <!-- <v-col 
                      v-for="language of tempForm.learning" 
                      :key="language" cols="12" md="6">
                          <v-slider
                            :label="language"
                            v-model="tempForm.languageLevel[language]"
                            :tick-labels="tickLabelsArray(tempForm.languageLevel[language])"
                            :max="3"
                            step="1"
                            ticks="always"
                            tick-size="4"
                          ></v-slider>
                      </v-col> -->
                    </v-row>
                  </v-col>
<!-- 
                  <v-col class="pt-5" v-if="tempForm.learning" cols="12" md="6">
                    <v-row>
                      
                    </v-row>
                  </v-col> -->

                  <!-- <v-col class="py-1" cols="12" md="6" sm="12">
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
                        >(+{{ tempForm.knows && tempForm.knows.length - selectMaxDisplay || 0 }} interests)</span>
                      </template>
                    </v-select>

                  </v-col> -->
                  <v-col cols="12" sm="12">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <!-- <v-btn color="primary" text @click="$nuxt.$emit('closeDialog', 'true')">
                        Cancel</v-btn
                      > -->
                      <!-- <v-btn
                        color="primary"
                        :disabled="!valid"
                        @click="
                          () => {
                            validateSubmit();
                          }
                        "
                      >
                        Save
                      </v-btn> -->
                      <v-btn
                        color="primary"
                        :disabled="!validLearning"
                        @click="
                          () => {
                            validateSubmit();
                          }
                        "
                      >
                        Continue
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
          </v-stepper-content>

        </v-stepper-items>
      </v-stepper>
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
      tickLabelsArray: {},
      languageLabels: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Native',
      ],
      tickLabels: [
        '',
        '',
        '',
        ''
      ],
      languages: [
        'English',
        'Japanese',
        'Chinese (Mandarin)',
        'Chinese (Cantonese)',
        'Korean',
        'Hindi',
        'Spanish',
        'French',
        'German'
      ],
      genders: [
        {value: '', text: 'Prefer not to say'},
        {value: 'male', text: 'Male'},
        {value: 'female', text: 'Female'}
      ],
      e1: 1,
      universityFound: true,
      validBasic: true,
      validLearning: true,
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
      menuBirthDate: false,
      required: [value => !!value || 'Required Field'],
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
    combinedLanguages() {
      if (!this.tempForm.knows && !this.tempForm.learning) {
        return []
      }
      return [...new Set([...(this.tempForm.knows || []), ...(this.tempForm.learning || [])])]
    },
    isSmallScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 900) ? false : true 
      }
      return true
    },
    isAccountComplete() {
      return this.account.firstName  && this.account.country && this.account.university && this.account.dateOfEntry && this.account.major && this.account.expectedGraduationYear && this.account.degree
    },
    isLearnerComplete() {
      return this.account.birthDate
    },
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
      if(this.tempForm && this.tempForm.knows && this.tempForm.knows.length == 5) {
        return true
      }
      if(this.tempForm && this.tempForm.learning && this.tempForm.learning.length == 5) {
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
    newInfoDialog: {
      handler(val) {
        this.fillForm();
      },
      immediate: true,
      deep: true
      
    },
  },
  methods: {
    setTickLabelsArray(language,level) {
      if (!this.isSmallScreen) {
        this.tickLabelsArray[language] = this.languageLabels
        this.$forceUpdate()
        return
      }
      const array = [...this.tickLabels]
      array[level] = this.languageLabels[level]
      this.tickLabelsArray[language] = array
      this.$forceUpdate()
    },
    updateLanguageLevel(data) {
      data.map(e => {
        if(!this.tempForm.languageLevel.hasOwnProperty(e)) {
          this.tempForm.languageLevel[e] = 0
          this.setTickLabelsArray(e,0)
        }
       
      })

      this.$forceUpdate()
    },
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

        birthDate: this.account.birthDate || '',
        bio: this.account.bio || '',
        gender: this.account.gender || 'male',
        knows: this.account.knows|| [],
        languageLevel: this.account.languageLevel || {},
        learning: this.account.learning || [],
        availability: this.account.availability || true
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

      this.birthDate =  this.tempForm.birthDate;
      this.bio =  this.tempForm.bio;
      this.gender =  this.tempForm.gender;
      this.knows =  this.tempForm.knows;
      this.learning =  this.tempForm.learning;
      this.languageLevel = this.tempForm.languageLevel;
      this.availability =  this.tempForm.availability;
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
    async validateBasicForm() {
      let isvalid = this.$refs.basicform.validate()
      if (this.universityFound && !this.tempForm.university) {
        this.universityFound = false
        this.$forceUpdate()
        this.$nextTick(()=> {
          this.$refs.basicform.validate()
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
            this.setAccount(data)
            $nuxt.$emit('success', "Successfully updated!!");
            // const uid = this.$parent._uid
            // this.$parent.$parent.$children.forEach(e => {
            //   if (uid !== e._uid) {
            //     e.$destroy()
            //   }
            // })
          })
          this.e1 = 2
        } catch(error) {
          $nuxt.$emit('error', "Could not set user information");
        }
        
      } else {
        alert("Invalid Field Present")
      }
    },
    async validateSubmit () {
      let isvalid = this.$refs.languageform.validate()
      const currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
            ...this.tempForm,
            createdAt: this.account.createdAt || currDate,
            updatedAt: currDate
          }
          let promises = []
          let promise1 = this.$fire.firestore.collection("users").doc(this.user.uid).update(data)
          let promise2 = this.$fire.firestore.collection("learners").doc(this.user.uid).set({
            userId: this.user.uid,
            createdAt: currDate
          })
          promises.push(promise1, promise2)
          await Promise.all(promises).then(()=>{
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
<style>

.v-slider__ticks-container .v-slider__tick .v-slider__tick-label {
  font-size: 12px;
  font-weight: bold;
  transform: translate(-50%);
}

</style>
<style lang="scss">
.v-input__slider  {
  label {
    font-size: 14px;
     min-width: 80px;
     max-width: 80px;
  }
 
}
</style>
