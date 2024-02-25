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
          Add Poll
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
                          <!-- <template slot-scope="{ save, cancel }">
                              <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                              <v-btn flat color="primary" @click="save">OK</v-btn>
                              </v-card-actions>
                          </template> -->
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
                            <!-- <template>
                                <v-card-actions style="width:100%;justify-content: flex-end">
                                <v-btn color="error" @click="e=>{expireTime='';modal2=false}">Cancel</v-btn>
                                <v-btn color="primary" @click="e=>{modal2=false}">Save</v-btn>
                                </v-card-actions>
                            </template> -->
                            </v-time-picker>
                        </v-dialog>
                    </v-flex>
                </v-layout>
              </v-col>
              <v-col>
                <v-select
                  v-model="poll.type"
                  :items="pollTypes"
                  label="Type of poll"
                ></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                    name="question"
                    label="Question"
                    id="question"
                    placeholder="Which of these is your best pet?"
                    v-model="poll.question"
                    type="text"
                    multi-line
                    rows="3"
                    class="input-group--focused"
                    :rules="rules.required">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                    name="hint"
                    label="Hint"
                    id="hint"
                    placeholder="pssh here is some hint"
                    v-model="poll.hint"
                    type="text"
                    multi-line
                    rows="3"
                    class="input-group--focused">
                </v-text-field>
              </v-col>
              <v-col class="pa-0" v-if="isChoice && poll.options.choices" cols="12">
                  <v-row
                    class="justify-center"
                    v-for="(choice, i) in poll.options.choices" 
                    :key="i">
                      <v-col cols="8">
                          <v-text-field
                              name="choice"
                              label="Choice"
                              id="choice1"
                              placeholder="Choice"
                              v-model="choice.value"
                              type="text"
                              multi-line
                              rows="1"
                              :rules="rules.required">
                          </v-text-field>
                      </v-col>
                      <v-col cols="1"> 
                          <v-btn text icon 
                              color="red"
                              @click="clearChoice(i)">
                              <v-icon>clear</v-icon>
                          </v-btn>
                      </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                        <v-btn fab small
                          class="ma-2"
                          @click="addChoice">
                          <v-icon >add</v-icon>
                        </v-btn>
                    </v-col>
                  </v-row>
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
        <!-- <v-btn
          color="error"
          @click="
            e => {
              deletePoll()
              dialog = false;
            }
          "
        >
          Delete
        </v-btn> -->
        <v-btn color="primary" text @click="cancelHandler">
          Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      pollTypes: [{text: 'Multi choice', value:'multi-choice'},
                  {text: 'Date', value:'date'},
                  {text: 'Single choice', value: 'single-choice'}],
      success: null,
      error: null,
      modal: false,
      modal2: false,
      dialog: false,
      valid: true,
      isValid: true,
      poll: {
        type: null,
        question: null,
        hint: null,
        options: {},
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
    poll: {
      handler(val) {
        if(this.isChoice && !val.options.choices) {
          this.addChoice()
          this.addChoice()
        }
      },
      deep: true
    },
    value(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit('input', val)
    }
  },
  computed: {
    isChoice() {
      return this.poll.type === 'multi-choice' || this.poll.type === 'single-choice'
    },
    user() {
      return this.$store.state.authUser
    }
  },
  methods: {
    cancelHandler() {
      this.poll = {type: null,
      question: null,
      options: {},}
      this.expireTime = '',
      this.expireDate = ''
      this.dialog = false
    },
    clearChoice (choiceIndex) {
      if (this.poll.options.choices.length <= 2) {
        this.error = 'Must have atleast 2 choices'
        setTimeout(()=> {
          this.error = null
        },2000)
        return
      }
        this.poll.options.choices.splice(choiceIndex, 1) 
        this.$forceUpdate()           
    },
    addChoice() {
       if (this.poll.options && this.poll.options.choices) {
        this.poll.options.choices.push({ value: '', count: 0 });
       } else if (this.poll.options) {
        this.poll.options['choices'] = [{ value: '', count: 0 }]
       } else if (this.poll) {
        this.poll['options'] = {
          choices: [{value: '', count: 0}]
        }
       }
      this.$forceUpdate()
    },
    async validateSubmit () {
      let isvalid = this.$refs.form.validate()
      if (this.isChoice && (!this.poll.options.choices || this.poll.options.choices.length < 2)) {
        this.error = "There must be atleast 2 choices."
        setTimeout(() => {
          this.error = null
        }, 2000)
        return
      }
      let setChoices = new Set(this.poll.options.choices.map(e => e.value))
      if (setChoices.size !== this.poll.options.choices.length) {
        this.error = "Duplicate choice found. Choices must be unique."
        setTimeout(() => {
          this.error = null
        }, 2000)
        return
      }
      if (isvalid) {
        try{
          await this.createPoll().then(()=>{
            // this.success = "Successfully updated!!"
            // setTimeout(()=>{
            //   this.success = null
            // },2000)
          })
        } catch(error) {
          this.error = "Could not set user information"
        }
      }
      this.$refs.form.validate()
    },
    async createPoll() {
      let currDate = Date.now().toString()
      let data = {
        ...this.poll,
        expireAt: Date.parse(this.expireDate+'T'+this.expireTime).toString(),
        creatorId: this.user.uid,
        createdAt: currDate,
        updatedAt: currDate,
      }
      await this.$fire.firestore.collection('polls').add(data)
      .then((doc) => {
        const id = doc.id
        this.$emit('poll', {id, ...data})
        this.cancelHandler()
        
        // this.polls.unshift({
        //   id: docRef.id,
        //   ...data,
        //   extractedContent: this.extractContent(data.content),
        //   updatedDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss'),
        //   createdDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss')
        // })
        
      })
      .catch((error) => {
          console.error("Error adding poll: ", error);
      });
    },
    async deletePoll() {
      await this.$fire.firestore.collection('polls').doc(this.newsItem.id).delete()
      .catch((error) => {
          console.error("Error deleting polls: ", error);
      });
      let index = this.news.map(e => e.id).indexOf(this.newsOriginalItem.id)
      try {
        this.news.splice(index, 1)
      } catch {
        console.log('index not found.')
      }
        
      this.newsOriginalItem = {}
    },
    async editPoll() {
      if (!this.newsItem.content) return;
      let currDate = Date.now().toString()
      let data = {
        content: this.newsItem.content,
        isPublished: this.newsItem.isPublished,
        creatorId: this.user.uid,
        createdAt: this.newsItem.createdAt,
        updatedAt: currDate,
      }

      await this.$fire.firestore.collection('polls').doc(this.newsItem.id).update(data)
      .catch((error) => {
          console.error("Error editing news: ", error);
      });
      this.newsOriginalItem.content = this.newsItem.content
      this.newsOriginalItem.extractedContent = this.extractContent(this.newsItem.content)
      this.newsOriginalItem.isPublished = this.newsItem.isPublished
      this.newsOriginalItem.creatorId = this.newsItem.creatorId
      this.newsOriginalItem.createdAt = this.newsItem.createdAt
      this.newsOriginalItem.updatedAt = this.newsItem.updatedAt
      this.newsOriginalItem.createdDate = moment(parseInt(this.newsItem.createdAt)).format('YYYY-MM-D HH:mm:ss'),
      this.newsOriginalItem.updatedDate =  moment(parseInt(this.newsItem.updatedAt)).format('YYYY-MM-D HH:mm:ss')
      this.newsOriginalItem = {}
      this.newsItem = {}
    },
  }
}
</script>