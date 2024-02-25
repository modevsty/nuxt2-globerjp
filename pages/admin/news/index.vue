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
      <div v-else>
        <v-card-title class="pb-0">Your News</v-card-title>
        <Spinner color="white" v-if="!pageLoaded"></Spinner>
        <div style="position:relative; margin-bottom: 25px !important;" v-else>
          <v-data-table
            :headers="[
            {text: 'content',
            value: 'extractedContent'},
            {text: 'Created Date',
            value: 'createdDate'},
            {text: 'Updated Date',
            value: 'updatedDate'},
            {text: 'isPublished',
            value: 'isPublished'}]"
            :group-by.sync="groupBy"
            :group-desc.sync="groupDesc"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items="news"
            :items-per-page="10"
            class="elevation-1"
            @click:row="handleClick"
          ></v-data-table>
          <v-dialog
            v-if="newsItem.content"
            v-model="editDialog"
            offset-y
            style="float:right"
            max-width="800px"
            scrollable
          >
            <v-card style="height:fit-content">
              <v-card-title>
                <span class="headline">
                  Edit News
                </span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="editForm"
                  class="pt-30"
                  v-model="validEdit"
                  lazy-validation
                >
                  <v-container style="max-width: 800px">
                    <v-row>
                      <v-col cols="12" md="12">
                        <MiniEditor v-model="newsItem.content" />
                        <v-textarea
                          v-show="false"
                          v-model="extractedContent"
                          :rules="contentRules"
                          label="News Content"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-checkbox
                          v-model="newsItem.isPublished"
                          :label="`Is published? ${newsItem && newsItem.isPublished && newsItem.isPublished.toString()}`"
                        ></v-checkbox>
                      </v-col>

                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="!validEdit"
                  @click="
                    e => {
                      validateEditSubmit();
                      editDialog = false;
                    }
                  "
                >
                  Save
                </v-btn>
                <v-btn
                  color="error"
                  @click="
                    e => {
                      deleteNews()
                      editDialog = false;
                    }
                  "
                >
                  Delete
                </v-btn>
                <v-btn color="primary" text @click="editDialog = false">
                  Cancel</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            v-model="dialog"
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
                  Add News
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
                        <MiniEditor v-model="content" />
                        <v-textarea
                          v-show="false"
                          v-model="newExtractedContent"
                          :rules="contentRules"
                          label="News Content"
                          required
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-checkbox
                          v-model="isPublished"
                          :label="`Is Published? ${isPublished.toString()}`"
                        ></v-checkbox>
                      </v-col>

                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  Cancel</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="
                    () => {
                      validateSubmit();
                      dialog = false;
                    }
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
import moment from 'moment'
import {cloneDeep} from 'lodash'
import Spinner from '@/components/LoadingSpinner'
import MiniEditor from '@/components/MiniEditor'
import { stripHtml } from "string-strip-html";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
export default {
  middleware: "auth",
  components: { Spinner, MiniEditor },
  layout: "default",
  name: "admin",
  data() {
    return {
      sortBy: "createdAt",
      sortDesc: true,
      groupBy: 'isPublished',
      groupDesc: false,
      news: [],
      newsItem: {},
      newsOriginalItem: {},
      dialog: false,
      editDialog: false,
      content: '',
      isPublished: false,
      contentRules: [
        v => !!v || 'Content is required',
        v => !!v && v.length >= 15 && v.length <= 180 || 'Name must be greater than 15 and less than 180 characters',
      ],
    }
  },
  computed: {
    extractedContent() {
      return this.newsItem && this.newsItem.content && this.extractContent(this.newsItem.content)
    },
    newExtractedContent() {
      return this.content && this.extractContent(this.content)
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
  async asyncData({store, $fire}) {
    let news = await $fire.firestore.collection('news').get()
    .then((querySnapshot) => {
      let out = []
      if (querySnapshot.size) {
        querySnapshot.forEach((doc) => {
        let data = doc.data()
        out.push({
          id: doc.id,
          ...data,
          extractedContent: stripHtml(data.content).result,
          updatedDate: !data.updatedAt? '' : moment(parseInt(data.updatedAt)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: !data.createdAt ? '' : moment(parseInt(data.createdAt)).format('YYYY-MM-D HH:mm:ss')
        })
      })
      }

      return out
    })
    return {
      news,
      pageLoaded: true
    }
  },
  methods: {
    extractContent(s, space) {
      return stripHtml(s).result;
    },
    handleClick(value) {
      this.newsItem = cloneDeep(value)
      this.newsOriginalItem = value
      this.editDialog = true
    },
    async validateEditSubmit () {
      let isvalid = this.$refs.editForm.validate()
      if (isvalid) {
        try{
          await this.editNews().then(()=>{
            this.success = "Successfully updated!!"
            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          this.error = "Could not set user information"
        }
      }
    },
    async validateSubmit () {
      let isvalid = this.$refs.form.validate()
      if (isvalid) {
        try{
          await this.createNews().then(()=>{
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
    },
    async deleteNews() {
      await this.$fire.firestore.collection('news').doc(this.newsItem.id).delete()
      .catch((error) => {
          console.error("Error deleting news: ", error);
      });
      let index = this.news.map(e => e.id).indexOf(this.newsOriginalItem.id)
      try {
        this.news.splice(index, 1)
      } catch {
        console.log('index not found.')
      }
        
      this.newsOriginalItem = {}
    },
    async editNews() {
      if (!this.newsItem.content) return;
      let currDate = Date.now().toString()
      let data = {
        content: this.newsItem.content,
        isPublished: this.newsItem.isPublished,
        creatorId: this.user.uid,
        createdAt: this.newsItem.createdAt,
        updatedAt: currDate,
      }

      await this.$fire.firestore.collection('news').doc(this.newsItem.id).update(data)
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
    async createNews() {
      if (!this.content) return;
      let currDate = Date.now().toString()
      let data = {
        content: this.content,
        isPublished: this.isPublished,
        creatorId: this.user.uid,
        createdAt: currDate,
        updatedAt: currDate,
      }
      this.content = ""
      await this.$fire.firestore.collection('news').add(data)
      .then((docRef) => {
        
        this.news.unshift({
          id: docRef.id,
          ...data,
          extractedContent: this.extractContent(data.content),
          updatedDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss'),
          createdDate: moment(parseInt(currDate)).format('YYYY-MM-D HH:mm:ss')
        })
        
      })
      .catch((error) => {
          console.error("Error adding news: ", error);
      });
    },
  }
}
</script>