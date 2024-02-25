<template>
<div>
  <v-dialog
    persistent
    v-model="dialog"
    offset-y
    content-class="mx-3"
    style="float:right; position: relative;"
    max-width="800px"
    scrollable
  >
            <v-alert style="position:absolute;left: 50%;
  z-index:100;
  bottom: 50px;
    max-width: min(calc(100% - 40px), 400px);
  transform: translate(-50%, -50%);
  margin: 0 0 auto; " type="success" :value="!!success">{{ success }}</v-alert>
      <v-alert style="position:absolute;left: 50%;
  z-index:100;
  bottom: 50px;
  max-width: min(calc(100% - 40px), 400px);
  transform: translate(-50%, -50%);
  margin: 0 0 auto; " type="error" :value="!!error">{{ error }}</v-alert>
    <v-card style="height:fit-content">
      <v-card-title>
        <span class="headline">
          Add Survey
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
                <v-layout row wrap>                                               
                    <v-flex xs11 sm5>
                      <v-dialog
                          v-model="modal"
                          width="290px">
                          <template v-slot:activator="{ on }">
                          <v-text-field
                              v-on="on"
                              label="Select expiration date"
                              v-model="expireDate"
                              prepend-icon="event"
                              readonly
                              :rules="rules.required"
                          ></v-text-field>
                          </template>
                          <v-date-picker v-model="expireDate" @input="modal = false" scrollable actions>
                          </v-date-picker>
                      </v-dialog>
                    </v-flex>

                    <v-spacer></v-spacer>

                    <v-flex xs11 sm5>
                        <v-dialog
                            v-model="modal2"
                            fullwidth
                            width="290px">
                            <template v-slot:activator="{ on }">
                              <v-text-field
                              v-on="on"
                              label="Select expiration time"
                              v-model="expireTime"
                              prepend-icon="access_time"
                              readonly
                              :rules="rules.required"
                              ></v-text-field>
                            </template>
                            <v-time-picker :persistent="false" v-model="expireTime" actions>
                            </v-time-picker>
                        </v-dialog>
                    </v-flex>
                </v-layout>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                    name="title"
                    label="Title"
                    id="title"
                    placeholder="Glober Title"
                    v-model="survey.title"
                    type="text"
                    multi-line
                    rows="3"
                    class="input-group--focused"
                    :rules="rules.required">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                    name="subtitle"
                    label="Subtitle"
                    id="subtitle"
                    placeholder="Glober subtitle"
                    v-model="survey.subtitle"
                    type="text"
                    multi-line
                    rows="3"
                    class="input-group--focused">
                </v-textarea>
              </v-col>
              <v-col class="pa-0" v-if="survey.polls && survey.polls.length" cols="12">
                  <v-row
                    class="justify-center py-2"
                    ref="pollbox"
                    style="position: relative"
                    v-for="(poll, i) in survey.polls" 
                    :key="i">
                      <v-col cols="12">
                      <PollBox :id="i + 1" v-model="survey.polls[i]"/>
                      </v-col>
                      <div style="position: absolute; right:10px; top:20px;"> 
                          <v-btn text icon 
                              color="red"
                              @click="clearPoll(i)">
                              <v-icon>clear</v-icon>
                          </v-btn>
                      </div>
                  </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center">
                  <v-btn
                    class="ma-2"
                    @click="addPoll">
                    <v-icon >add</v-icon>
                    <span>Add Poll</span>
                  </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!valid"
          @click="
            e => {
              validateSubmit();
            }
          "
        >
          Save
        </v-btn>
        <v-btn color="primary" text @click="cancelHandler">
          Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>
<script>
import PollBox from '@/components/PollBox/edit';
export default {
  components: {
    PollBox
  },
  data() {
    return {
      success: null,
      error: null,
      modal: false,
      modal2: false,
      dialog: false,
      valid: true,
      isValid: true,
      survey: {
        subtitle: null,
        title: null,
        polls: [],
      },
      expireDate: '',
      expireTime: '',
      rules: {
        required: [value => !!value || 'Required Field'],
      },
      contentRules: [
        v => !!v || 'Content is required',
        v => !!v && v.length >= 15 && v.length <= 180 || 'Name must be greater than 15 and less than 180 characters',
      ],
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // survey: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true
    // },
    value(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit('input', val)
    }
  },
  computed: {
    user() {
      return this.$store.state.authUser
    }
  },
  methods: {
    isChoice(poll) {
      return poll.type === 'multi-choice' || poll.type === 'single-choice'
    },
    cancelHandler() {
      this.survey = {
        subtitle: null,
        title: null,
        polls: [],
      },
      this.expireTime = '',
      this.expireDate = ''
      this.dialog = false
    },
    clearPoll (choiceIndex) {
      if (!this.survey.polls.length) {
        this.error = 'Must have some polls'
        setTimeout(()=> {
          this.error = null
        },2000)
        return
      }
        this.survey.polls.splice(choiceIndex, 1) 
        this.$forceUpdate()           
    },
    addPoll() {
       if (this.survey && this.survey.polls ) {
        this.survey.polls.push({type: null,
        question: null,
        hint: null,
        options: {},
        valid: false});
       } else {
          this.error = "Survey polls is not array."
          setTimeout(() => {
            this.error = null
          }, 2000)
          return
       }
      this.$forceUpdate()
    },
    async validateSubmit () {

      let isValidSurvey = this.$refs.form.validate()
      if (!isValidSurvey) {
        this.error = "Missing Fields."
        setTimeout(() => {
          this.error = null
        }, 2000)
        return
      }
      if (!this.survey.polls.length) {
        this.error = "Survey must contain atleast one poll."
        setTimeout(() => {
          this.error = null
        }, 2000)
        return
      }
      const isValidForms = this.$refs.form.$children.filter(e => {
        if (e.$refs && e.$refs.form) {
          return true
        }
        else {
          return false
        }
      }).map(e => {
        return e.$refs.form.validate()
      })
      // const isValidForms = validForms.map(e => e.validate())

      if (!isValidForms.every(Boolean)) {
        this.error = "Missing poll fields."
        setTimeout(() => {
          this.error = null
        }, 2000)
        return
      }
      
      let promises = []
      this.survey.polls.forEach(poll => {
        promises.push(this.createPoll(poll))
      })
      try{
        const polls = await Promise.all(promises)
        let currDate = Date.now().toString()
        let data = {
          ...this.survey,
          polls,
          expireAt: Date.parse(this.expireDate+'T'+this.expireTime).toString(),
          creatorId: this.user.uid,
          createdAt: currDate,
          updatedAt: currDate,
        }
        await this.$fire.firestore.collection('surveys').add(data).then((doc)=>{
          const id = doc.id

          this.$emit('survey', {id,...data})
          this.cancelHandler()
        })
      } catch(error) {
        this.error = "Could not set survey information" + error
      }
      this.$refs.form.validate()
    },
    createPoll(poll) {
      let currDate = Date.now().toString()
      let data = {
        ...poll,
        expireAt: Date.parse(this.expireDate+'T'+this.expireTime).toString(),
        creatorId: this.user.uid,
        createdAt: currDate,
        updatedAt: currDate,
      }
      return this.$fire.firestore.collection('polls').add(data)
      .then((doc) => {
        const id = doc.id
        return id
      })
      .catch((error) => {
          console.error("Error adding poll: ", error);
      });
    },
  }
}
</script>