<template>
<div>
  <div>
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
          Poll - {{ id }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          class="pt-30"
          v-model="valid"
        >
          <v-container style="max-width: 800px">
            <v-row>
              <!-- <v-col cols="12" md="12">
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
              </v-col> -->
              <v-col>
                <v-select
                  v-model="poll.type"
                  :items="pollTypes"
                  label="Type of poll"
                  :rules="rules.required"
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
    </v-card>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      pollTypes: [{text: 'Multi choice', value:'multi-choice'},
                  {text: 'Single choice', value: 'single-choice'}],
      success: null,
      error: null,
      modal: false,
      modal2: false,
      valid: true,
      poll: {
        type: null,
        question: null,
        hint: null,
        options: {},
      },
      isValid: true,
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
    id: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      required: true
    },
  },
  watch: {
    poll: {
      handler(val) {
        if(this.isChoice && !val.options.choices) {
          this.addChoice()
          this.addChoice()
        }
        this.$emit('input', val)
      },
      deep: true
    },
    value: {
      handler(val) {
        this.poll = val
      },
      deep: true,
      immediate: true

    },
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
  }
}
</script>