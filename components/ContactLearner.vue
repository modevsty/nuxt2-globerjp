<template>
  <div>
    <v-card style="height:fit-content">
      <v-card-title class="px-6">
        <span style="word-break:break-word;">
          What would you like {{ value && value.showName? value.showName: 'them' }} to know about you?
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
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <v-text-field
              class="py-0 pt-3 pb-1"
                :rules="emailRules"
                v-model="tempForm.email"
                label="E-mail"
              ></v-text-field>
              <!-- <div class="py-0" style="text-align:center">or</div> -->
              <v-text-field
              class="py-0 pt-4 pb-1"
                v-model="tempForm.instagramId"
                label="Instagram Id"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12" md="6" sm="12">
              <v-textarea
                :rules="[v=>!!v || 'This field is required']"
                v-model="tempForm.message"
                label="Message"
                required
                rows="4"
              ></v-textarea>
            </v-col>

            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-textarea
                :rules="[v=>!!v || 'This field is required']"
                v-model="tempForm.msgKnows"
                label="Languages I speak"
                required
                
              ></v-textarea>
            </v-col>

            <v-col class="py-1" cols="12" md="6" sm="12">
              <v-textarea
                :rules="[v=>!!v || 'This field is required']"
                v-model="tempForm.msgLearning"
                label="Languages I want to learn"
                required
              ></v-textarea>
            </v-col>

            
  

            
            <v-col cols="12">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="clearData()">
                  Clear</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="validateSubmit"
                >
                  Send
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import fixtures from "@/fixtures/fixtures.json"
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import moment from 'moment';
export default {
    components: {Treeselect},
    props: [
      'value',
      'success',
      'error'
    ],
    data() {
    return {
      valid: true,
      pageLoaded: false,
      tempForm: {},
      firstName: "",
      lastName: "",
      email: "",
      instagramId: "",
      knows: "",
      learning: "",
      message: "",
      emailRules: [
        v => !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      firstNameRules: [
        v => !!v && !!v.replace(/\s/g, '').length || 'First Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      lastNameRules: [
        v => !!v || 'Last Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
    };
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 800) ? false : true 
      }
      return true
    },
    user() {
      return this.$store.state.authUser
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
  },
  watch: {
    value: {
      handler() {
         this.fillForm();
      },
      immediate: true,
      deep: true
     
    },
  },
  methods: {
    clearData() {
      
      // this.tempForm = {}
      this.$refs.form.reset()
    },
    fillForm() {
      if (!this.account) return

      let msgKnows = this.account.knows?.join(', ') || '';
      let msgLearning = this.account.learning?.join(', ') || ''
      this.tempForm = {
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        email: this.account.email,
        instagramId: '',
        knows: this.account.knows,
        learning: this.account.learning,
        msgKnows,
        msgLearning,
        message: this.account.bio,
      }
    },
    ...mapActions({
      fetchAccount: 'account/FETCH_ACCOUNT'
    }),
    ...mapMutations({
      setAccount: 'account/SET_ACCOUNT'
    }),
    async validateSubmit () {
      let isvalid = this.$refs.form.validate()
      if (!this.tempForm.email && !this.tempForm.instagramId) {
        alert("Either email or instagram id must be present.")
        return
      }
      const currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
              fromEmail: this.tempForm.email,
              toEmail: this.value.email,
              message: this.tempForm.message,
              knows: this.tempForm.knows,
              learning: this.tempForm.learning,
              msgKnows: this.tempForm.msgKnows,
              msgLearning: this.tempForm.msgLearning,
              fromInstagramId: this.tempForm.instagramId,
              fromName: this.value.fromName,
              toName: this.value.toName,
              fromId: this.user.uid,
              toId: this.value.id,
              updatedAt: currDate,
              emailSentAt: null
            }
  
          let oldData = await this.$fire.firestore.collection("contacts")
              .doc(`${this.user.uid}${this.value.id}`).get()


          if (oldData.exists) {
            oldData = oldData.data()
            data['createdAt'] = oldData.createdAt
            let oldEmailSentAt = parseInt(oldData.updatedAt)

            if (oldEmailSentAt && moment(oldEmailSentAt)) {
              const minutes = moment().diff(oldEmailSentAt, 'minutes')
              if (minutes < 30) {
                $nuxt.$emit('error',`One email has already been sent. Please wait ${(30 - minutes)} ${(30 - minutes) === 1? 'minute': 'minutes'} before sending a new message.`)
                return
              }
            }
          } else {
            data['createdAt'] = currDate
          }

          await this.$fire.firestore.collection("contacts").doc(`${this.user.uid}${this.value.id}`).set(data).then(()=>{
            this.setAccount(data)
            this.$emit('createRoom', data.message)
            $nuxt.$emit('success', "Successfully sent the email!!");
          })
        } catch(error) {
          $nuxt.$emit('error', "Could not send the email!!");
        }
      }
      this.$refs.form.validate()
    },
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
