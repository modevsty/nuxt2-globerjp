<template>
  <div>
    <v-container v-if="!user">
      <h1>
        You must be logged in to view this page.
      </h1>
      <v-btn
        class="pa-0 primary--text"
        style="text-transform: unset !important; font-size: 16px !important;"
        @click="handleJoin()"
        text
        >Click here to Join</v-btn
      >
    </v-container>
    <v-container v-else>
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
      <div>
        <v-card-title class="pb-0">Your Surveys</v-card-title>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
        <div style="position:relative; margin-bottom: 25px !important;" v-else>
          <v-data-table
            :headers="[
            {text: 'Title',
            value: 'alteredTitle'},
            {text: 'Created Date',
            value: 'createdDate'},
            {text: 'Updated Date',
            value: 'updatedDate'},
            {text: 'Expire Date',
            value: 'expireDate'},
            {text: 'Link',
            value: 'link'},
            ]"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="surveys"
            :items-per-page="10"
            class="elevation-1"
            @click:row="handleClickSurvey"
          >
          <template v-slot:item.link="{ item }">
            <v-btn style="width: 100%;" v-if="isLinkLoaded[item.id]" text class="primary--text" @click.stop="e=>{$router.push({path: item.link})}" >
              <v-icon medium color="primary">mdi-open-in-new</v-icon>
            </v-btn>
            <v-img
              v-else
              transition="xxx"
              :ref="'survey-link-'+item.id"
              :eager="true"
              contain
              height="25"
              :src="lazyGifSmall"
              alt=""
            />
          </template>
          </v-data-table>
          <SurveyDialogEdit v-model="surveyEditDialog" v-if="surveyEditDialog" :originalSurvey="surveyItem" @survey="surveyHandlerEdit" />
          
          <v-row>
            <v-col class="pb-0">
              <v-btn
                fab
                bottom
                
                absolute
                style="margin:auto;left:0;right:0"
                color="primary" dark
                @click="openSurveyCreateDialog"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <SurveyDialogCreate v-model="surveyCreateDialog" @survey="surveyHandlerCreate"/>

        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
import moment from 'moment'
import {cloneDeep} from 'lodash'
import Spinner from '@/components/LoadingSpinner'
import PollDialogCreate from '@/components/PollDialog/create'
import PollDialogEdit from '@/components/PollDialog/edit'
import SurveyDialogCreate from '@/components/SurveyDialog/create'
import SurveyDialogEdit from '@/components/SurveyDialog/edit'
import { stripHtml } from "string-strip-html";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner, PollDialogCreate, PollDialogEdit, SurveyDialogCreate, SurveyDialogEdit },
  layout: "default",
  name: "admin",
  data() {
    return {
      lazyGifSmall: 'data:image/gif;base64,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',
      error: null,
      success:  null,
      pageLoaded: false,
      sortBy: "createdAt",
      sortDesc: true,
      groupBy: '',
      groupDesc: false,
      polls: [],
      pollItem: {},
      pollOriginalItem: {},
      surveys: [],
      surveyItem: null,
      surveyOriginalItem: {},
      editDialog: false,
      createDialog: false,
      surveyEditDialog: false,
      surveyCreateDialog: false,
      linkLoadedTimer: null
    }
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
  },
  async asyncData({store, $fire}) {
    const isLinkLoaded = {}
    let surveys = await $fire.firestore.collection('surveys')
    .where('creatorId','==',store.state.authUser.uid).get()
    .then((querySnapshot) => {
      let out = []
      if (querySnapshot.size) {
        querySnapshot.forEach((doc) => {
        let id = doc.id
        let data = doc.data()
        out.push({
          id,
          ...data,
          alteredTitle: (data.title.length <= 80? data.title : data.title.substr(0,80) + '...'),
          expireDate: !data.expireAt? '' : moment(parseInt(data.expireAt)).format('YYYY-MM-D HH:mm:ss'),
          updatedDate: !data.updatedAt? '' : moment(parseInt(data.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: !data.createdAt ? '' : moment(parseInt(data.createdAt)).format('YYYY-MM-D HH:mm:ss'),
          link: `/survey/${doc.id}`
        })
        isLinkLoaded[id] = true
        
      })
      }

      return out
    })

    return {
      surveys,
      pageLoaded: true,
      isLinkLoaded
    }
  },
  methods: {
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    getLink(id) {
      return `/survey/${id}`
    },
    surveyHandlerCreate(val) {
      clearTimeout(this.linkLoadedTimer)
      this.isLinkLoaded[val.id] = false
       this.surveys.unshift({
          ...val,
          alteredTitle: (val.title.length <= 80? val.title : val.title.substr(0,80) + '...'),
          expireDate:  moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss'),
          updatedDate: moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss'),
          link: this.getLink(val.id)
        })
        this.success = "Successfully updated!!"

        setTimeout(()=>{
          this.success = null
        },2000)
        this.linkLoadedTimer = setTimeout(() => {
          this.isLinkLoaded[val.id] = true
        },6000)
    },
    surveyHandlerEdit(val) {
      clearTimeout(this.linkLoadedTimer)
      this.isLinkLoaded[val.id] = false
      if (!val) {
       let index = this.surveys.map(e => e.id).indexOf(this.surveyItem.id)
       try {
          this.surveys.splice(index, 1)
        } catch {
          console.log('index not found.')
        }
      } else {
          this.surveyOriginalItem.title = val.title
          this.surveyOriginalItem.subtitle = val.subtitle
          this.surveyOriginalItem.polls = val.polls
          this.surveyOriginalItem.alteredTitle = (val.title.length <= 80? val.title : val.title.substr(0,80) + '...')
          this.surveyOriginalItem.expireDate = moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss')
          this.surveyOriginalItem.updatedDate =  moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss')
          this.surveyOriginalItem.createdDate =  moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss')
          this.surveyOriginalItem.creatorId = val.creatorId
          this.surveyOriginalItem.link = this.getLink(val.id)
      }
      this.$forceUpdate()
      this.surveyOriginalItem = {}
      this.surveyItem = {}

      this.success = "Successfully updated!!"
        setTimeout(()=>{
          this.success = null
        },2000)
      this.linkLoadedTimer = setTimeout(() => {
          this.isLinkLoaded[val.id] = true
        },7000)
    },
    // pollHandlerCreate(val) {
    //    this.polls.unshift({
    //       ...val,
    //       alteredQuestion: val.question.substr(0,20) + '...',
    //       expireDate:  moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss'),
    //       updatedDate: moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
    //       createdDate: moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss'),
    //       link: this.getLink(val.id)
    //     })
    //     this.success = "Successfully updated!!"
    //     setTimeout(()=>{
    //       this.success = null
    //     },2000)
    // },
    // pollHandlerEdit(val) {
    //   console.log(val)
    //   if (!val) {
    //    let index = this.polls.map(e => e.id).indexOf(this.pollItem.id)
    //    try {
    //       this.polls.splice(index, 1)
    //     } catch {
    //       console.log('index not found.')
    //     }
    //   } else {
    //       this.pollOriginalItem.question = val.question
    //       this.pollOriginalItem.options = val.options
    //       this.pollOriginalItem.type = val.type
    //       this.pollOriginalItem.alteredQuestion = val.question.substr(0,20) + '...'
    //       this.pollOriginalItem.expireDate = moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss')
    //       this.pollOriginalItem.updatedDate =  moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss')
    //       this.pollOriginalItem.createdDate =  moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss')
    //       this.pollOriginalItem.creatorId = val.creatorId
    //       this.pollOriginalItem.link = this.getLink(val.id)
    //   }
    //   this.pollOriginalItem = {}
    //   this.pollItem = {}
    //   this.success = "Successfully updated!!"
    //     setTimeout(()=>{
    //       this.success = null
    //     },2000)
    // },
    openCreateDialog() {
      this.createDialog = true
    },
    openSurveyCreateDialog() {
      this.surveyCreateDialog = true
    },
    handleClick(value) {
      this.pollItem = cloneDeep(value)
      this.pollOriginalItem = value
      this.editDialog = true
    },
    handleClickSurvey(value) {
      if (!this.isLinkLoaded[value.id]) {
        return
      }
      this.surveyItem = cloneDeep(value)
      this.surveyOriginalItem = value
      this.surveyEditDialog = true
    },
  }
}
</script>