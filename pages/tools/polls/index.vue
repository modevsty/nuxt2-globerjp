<template>
  <div>
    <Spinner color="white" v-if="!user"></Spinner>
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
        <v-card-title class="pb-0">Your Polls</v-card-title>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
        <div style="position:relative; margin-bottom: 25px !important;" v-else>
          <v-data-table
            :headers="[
            {text: 'Question',
            value: 'alteredQuestion'},
            {text: 'Created Date',
            value: 'createdDate'},
            {text: 'Updated Date',
            value: 'updatedDate'},
            {text: 'Expire Date',
            value: 'expireDate'},
            {text: 'Type',
            value: 'type'},
            {text: 'Link',
            value: 'link'},
            ]"
            :group-by.sync="groupBy"
            :group-desc.sync="groupDesc"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="polls"
            :items-per-page="10"
            class="elevation-1"
            @click:row="handleClick"
          >
          <template v-slot:item.link="{ item }">
            <v-btn nuxt-link text class="primary--text" :to="item.link" >
              <v-icon medium color="primary">mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          </v-data-table>
          <PollDialogEdit v-model="editDialog" :originalPoll="pollItem" @poll="pollHandlerEdit" />
          
          <v-row>
            <v-col class="pb-0">
              <v-btn
                fab
                bottom
                
                absolute
                style="margin:auto;left:0;right:0"
                color="primary" dark
                @click="openCreateDialog"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <PollDialogCreate v-model="createDialog" @poll="pollHandlerCreate"/>

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
import { stripHtml } from "string-strip-html";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner, PollDialogCreate, PollDialogEdit },
  layout: "default",
  name: "admin",
  data() {
    return {
      error: null,
      success:  null,
      pageLoaded: false,
      sortBy: "createdAt",
      sortDesc: true,
      groupBy: 'isPublished',
      groupDesc: false,
      polls: [],
      pollItem: {},
      pollOriginalItem: {},
      editDialog: false,
      createDialog: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.authUser
    },
  },
  async asyncData({store, $fire}) {
    let polls = await $fire.firestore.collection('polls')
    .where('creatorId','==',store.state.authUser.uid).get()
    .then((querySnapshot) => {
      let out = []
      if (querySnapshot.size) {
        querySnapshot.forEach((doc) => {
        let data = doc.data()
        out.push({
          id: doc.id,
          ...data,
          alteredQuestion: data.question.substr(0,20) + '...',
          expireDate: !data.expireAt? '' : moment(parseInt(data.expireAt)).format('YYYY-MM-D HH:mm:ss'),
          updatedDate: !data.updatedAt? '' : moment(parseInt(data.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: !data.createdAt ? '' : moment(parseInt(data.createdAt)).format('YYYY-MM-D HH:mm:ss'),
          link: `/tools/polls/${doc.id}`
        })
      })
      }

      return out
    })
    return {
      polls,
      pageLoaded: true
    }
  },
  methods: {
    getLink(id) {
      return `/tools/polls/${id}`
    },
    pollHandlerCreate(val) {
       this.polls.unshift({
          ...val,
          alteredQuestion: val.question.substr(0,20) + '...',
          expireDate:  moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss'),
          updatedDate: moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss'),
          link: this.getLink(val.id)
        })
        this.success = "Successfully updated!!"
        setTimeout(()=>{
          this.success = null
        },2000)
    },
    pollHandlerEdit(val) {
      if (!val) {
       let index = this.polls.map(e => e.id).indexOf(this.pollItem.id)
       try {
          this.polls.splice(index, 1)
        } catch {
          console.log('index not found.')
        }
      } else {
          this.pollOriginalItem.question = val.question
          this.pollOriginalItem.hint = val.hint
          this.pollOriginalItem.options = val.options
          this.pollOriginalItem.type = val.type
          this.pollOriginalItem.alteredQuestion = val.question.substr(0,20) + '...'
          this.pollOriginalItem.expireDate = moment(parseInt(val.expireAt)).format('YYYY-MM-D HH:mm:ss')
          this.pollOriginalItem.updatedDate =  moment(parseInt(val.updatedAt)).format('YYYY-MM-D HH:mm:ss')
          this.pollOriginalItem.createdDate =  moment(parseInt(val.createdAt)).format('YYYY-MM-D HH:mm:ss')
          this.pollOriginalItem.creatorId = val.creatorId
          this.pollOriginalItem.link = this.getLink(val.id)
      }
      this.pollOriginalItem = {}
      this.pollItem = {}
      this.success = "Successfully updated!!"
        setTimeout(()=>{
          this.success = null
        },2000)
    },
    openCreateDialog() {
      this.createDialog = true
    },
    handleClick(value) {
      this.pollItem = cloneDeep(value)
      this.pollOriginalItem = value
      this.editDialog = true
    },
  }
}
</script>