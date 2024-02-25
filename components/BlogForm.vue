<template>
  <div class="d-flex justify-center pa-2">
    <v-row style="max-width: 100%;">
      <v-col cols="12" class="col-lg-8">
        <v-row>
        <v-col>
          <v-row class="d-flex flex-column justify-center align-center">
            <v-col class="mb-4">
              <v-text-field id="title" v-model="blog.title" type="text" placeholder="Title" @input="updateId" />
            </v-col>
            <v-col>
            <editor v-model="blog.body" />
            </v-col>
            <v-col style="display:none">
            <code-editor  v-model="codeEditorBody" />
            </v-col>
          </v-row>
        </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="mt-lg-4 col-lg-4" style="position: relative;">
        <v-card class="pa-5 blog-form-options-box">
          <div>
            <v-text-field id="id" ref="id" v-model="blog.id" type="text" placeholder="ID" />
          </div>
          <div>
              <v-checkbox label="Published" v-model="blog.published" class="mr-2 leading-tight" type="checkbox" />
          </div>

          <!-- <div>
            <v-text-field id="imageAlt" v-model="blog.imageAlt" type="text" placeholder="Image Alt" />
          </div> -->
          <v-expansion-panels flat style="border: thin solid rgba(0,0,0,0.12)">
            <v-expansion-panel>
              <v-expansion-panel-header>
                Additional Options...
              </v-expansion-panel-header>
              <v-expansion-panel-content style="max-height: 300px; overflow: overlay;">
                  <div class="mb-4">
                    <label>Image</label>
                    <div v-if="blog.imageUrl">
                      <v-img :src="blog.imageUrl" contain class="object-cover inline-block" style="height:auto; height: 300px; width:100%; " alt="" />
                      <button
                        v-if="blog.imageUrl"
                        :disabled="isDeletingImage"
                        type="button"
                        class="bg-red-500 border-red-300 text-white"
                        @click="deleteImage"
                      >
                        {{ isDeletingImage ? 'Deleting...' : 'Delete' }}
                      </button>
                    </div>
                    <button
                      v-if="!blog.imageUrl"
                      :disabled="isUploadingImage"
                      type="button"
                      @click="launchImageFile"
                    >
                      {{ isUploadingImage ? 'Uploading...' : 'Upload' }}
                    </button>
                    <input
                      style="max-width: 100%;"
                      ref="imageFile"
                      type="file"
                      accept="image/png, image/jpeg"
                      class="hidden"
                      @change.prevent="uploadImageFile($event.target.files)"
                    >
                  </div>
                  <div class="mb-4">
                    <v-textarea id="imageCaption" v-model="blog.imageCaption" placeholder="Image caption if any..." rows="2" />
                  </div>
                  <div class="mb-4">
                    <v-select
                      :items="subcategories"
                      label="Sub-Category"
                      v-model="subcategory"
                      item-text="text"
                      item-value="value"
                      dense
                    ></v-select>
                  </div>
                  <div class="mb-4">
                    <v-select
                      :items="categories"
                      label="Category"
                      v-model="category"
                      item-text="text"
                      item-value="value"
                      dense
                    ></v-select>
                  </div>
                  <div class="mb-4">
                    <v-text-field id="tags" v-model="tags" type="text" placeholder="Tags seperated by comma" />
                  </div>
                  <div class="mb-4">
                    <v-textarea id="lead" v-model="blog.lead" placeholder="Blog Subtitle if any..." rows="1" />
                  </div>
                  <div class="mb-4">
                    <v-textarea id="teaser" v-model="blog.teaser" placeholder="Blog Teaser if any..." rows="1" />
                  </div>
                  <div class="mb-4">
                    <v-textarea id="description" v-model="blog.description" placeholder="Blog Description if any..." rows="2"/>
                  </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div class="mb-4 mt-6 clearfix">
            <v-row class="d-flex">
              <v-col cols="12" class="col-lg-6">
                <v-btn
                  :disabled="!!status"
                  type="button"
                  class="blue float-lg-left"
                  @click="submitForm"
                >
                  {{ status ? status : 'Save' }}
                </v-btn>
                
              </v-col>
              <!-- <v-col cols="12" class="col-lg-4">
                <v-btn nuxt :to="`/blog/${blog.id}/preview`" 
                class="" style="color:black !important;" target="_blank caution">Preview</v-btn>
              </v-col> -->
              <v-col cols="12" class="col-lg-6">
                <v-btn
                  type="button"
                  class="error text-white float-lg-right"
                  @click="confirmDelete"
                >
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import Editor from '@/components/Editor'
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'BlogForm',
  components: { Editor, CodeEditor },
  props: {
    value: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      codeEditorBody: '',
      categories: [
        {value: '', text:''},
        {value:'immigration', text:'Immigration Related'},
        {value: 'finance', text: 'Finance Related'},
        {value:'daily_life', text: 'Daily Life'},
        {value: 'leisure', text: 'Leisure'},
        {value: 'miscellaneous', text: 'Others...'},
        {value: 'medical', text: 'Medical Related'},
      ],
      CATEGORIES: [
        {value: '', text:''},
        {value:'immigration', text:'Immigration Related'},
        {value: 'finance', text: 'Finance Related'},
        {value:'daily_life', text: 'Daily Life'},
        {value: 'leisure', text: 'Leisure'},
        {value: 'miscellaneous', text: 'Others...'},
        {value: 'medical', text: 'Medical Related'},
      ],
      parentsOf: {
        job_hunting: [{value: '', text:''},{ value: 'finance', text: 'Finance Related'}],
        housing: [{value: '', text:''},{value:'daily_life', text: 'Daily Life'}],
        parttime_jobs: [{value: '', text:''},{value: 'finance', text: 'Finance Related'}],
        scholarship: [{value: '', text:''},{value: 'finance', text: 'Finance Related'}],
        banking: [{value: '', text:''},{value: 'finance', text: 'Finance Related'}],
        garbage:  [{value: '', text:''},{value:'daily_life', text: 'Daily Life'}],
        phone: [{value: '', text:''},{value:'daily_life', text: 'Daily Life'}],
        transportation: [{value: '', text:''},{value:'daily_life', text: 'Daily Life'}],
        insurance: [{value: '', text:''},{value: 'finance', text: 'Finance Related'},{value: 'medical', text: 'Medical Related'}],
        medical: [{value: '', text:''},{value: 'medical', text: 'Medical Related'}],
        immigration: [{value: '', text:''},{value:'immigration', text:'Immigration Related'}],
        food: [{value: '', text:''},{value: 'leisure', text: 'Leisure'}],
        traveling: [{value: '', text:''},{value: 'leisure', text: 'Leisure'}],
        extra_curricular_activities: [{value: '', text:''},{value: 'leisure', text: 'Leisure'}]
      },
      childrenOf: {
        immigration: [{value: '', text:''},
          {value:'immigration', text:'Immigration Related'},
        ],
        medical: [{value: '', text:''},
          {value: 'medical', text: 'Medical Related'},
          {value: 'insurance', text: 'Insurance and National Pension'},
        ],
        finance: [{value: '', text:''},
          {value:'job_hunting', text:'Job Hunting'},
          {value: 'parttime_jobs', text: 'Part-time Jobs'},
          {value: 'scholarship', text: 'Scholarship'},
          {value:'banking', text: 'Banking'},
          {value: 'insurance', text: 'Insurance and National Pension'},
        ],
        daily_life: [{value: '', text:''},
          {value:'housing', text: 'Housing'},
          {value:'garbage', text: 'Garbage and recycling'},
          {value: 'phone', text: 'Phone and Post Office'},
          {value: 'transportation', text: 'Transportation/Bicycles'},
        ],
        leisure: [{value: '', text:''},
          {value: 'food', text: 'Food'},
          {value: 'traveling', text: 'Traveling'},
          {value: 'extra_curricular_activities', text: 'Extra Curricular Activities'}
        ]
      },
      subcategories: [
        {value: '', text:''},
        {value:'immigration', text:'Immigration Related'},
        {value:'job_hunting', text:'Job Hunting'},
        {value:'housing', text: 'Housing'},
        {value: 'parttime_jobs', text: 'Part-time Jobs'},
        {value: 'scholarship', text: 'Scholarship'},
        {value:'banking', text: 'Banking'},
        {value:'garbage', text: 'Garbage and recycling'},
        {value: 'phone', text: 'Phone and Post Office'},
        {value: 'transportation', text: 'Transportation/Bicycles'},
        {value: 'insurance', text: 'Insurance and National Pension'},
        {value: 'medical', text: 'Medical Related'},
        {value: 'food', text: 'Food'},
        {value: 'traveling', text: 'Traveling'},
        {value: 'extra_curricular_activities', text: 'Extra Curricular Activities'}
      ],
      SUBCATEGORIES: [
        {value: '', text:''},
        {value:'immigration', text:'Immigration Related'},
        {value:'job_hunting', text:'Job Hunting'},
        {value:'housing', text: 'Housing'},
        {value: 'parttime_jobs', text: 'Part-time Jobs'},
        {value: 'scholarship', text: 'Scholarship'},
        {value:'banking', text: 'Banking'},
        {value:'garbage', text: 'Garbage and recycling'},
        {value: 'phone', text: 'Phone and Post Office'},
        {value: 'transportation', text: 'Transportation/Bicycles'},
        {value: 'insurance', text: 'Insurance and National Pension'},
        {value: 'medical', text: 'Medical Related'},
        {value: 'food', text: 'Leisure: Food'},
        {value: 'traveling', text: 'Leisure: Traveling'},
        {value: 'extra_curricular_activities', text: 'Extra Curricular Activities'}
      ],
      blog: {},
      tags: '',
      status: '',
      originalId: '',
      blogMeta: {},
      category: '',
      subcategory: '',
      isUploadingImage: false,
      isDeletingImage: false,
      FULL_IMAGE: {
        maxDimension: 1280,
        quality: 0.9
      },
      THUMB_IMAGE: {
        maxDimension: 640,
        quality: 0.7
      }
    }
  },
  watch: {
    value: {
      handler (newValue) {
        this.blog = cloneDeep(newValue)
        this.category = this.blog.category || ''
        this.subcategory = this.blog.subcategory || ''
        this.blog.body = this.blog.body || ''
        this.tags = this.blog.tags ? this.blog.tags.join() : ''
      },
      immediate: true
    },
    blog: {
      handler (val) {

        this.codeEditorBody = val.body;
      },
      deep: true
    },
    category(val, old) {
      if (val == old) {
        return
      }
      this.blog.category = val
      if (!val) {
        this.subcategory = ''
        this.subcategories = this.SUBCATEGORIES
        return
      }
      if (!this.subcategory) {
        this.subcategories = this.childrenOf[val]
      }
    },
    subcategory(val, old) {
      if (val == old) {
        return
      }
      this.blog.subcategory = val
      if (!val) {
        this.category = ''
        this.categories = this.CATEGORIES
        return
      }
      if(!this.category) {
        this.categories = this.parentsOf[val]
      }
    },
    codeEditorBody: {
      handler (val) {
        this.blog.body = val;
      }
    }
  },
  mounted () {
    this.originalId = this.blog.id
  },
  computed: {
    user() {
      return this.$store.state.authUser
    }
  },
  methods: {
    async submitForm () {
      if (!this.blog.id) {
        // eslint-disable-next-line no-alert
        alert('Please enter the blog ID.')
        this.$refs.id.focus()
        return
      }

      if (this.originalId !== this.blog.id) {
        const exists = await this.checkExists(this.blog.id)
        if (exists) {
          // eslint-disable-next-line no-alert
          alert('Blog ID already exists. Please enter a unique blog ID.')
          this.$refs.id.focus()
          return
        }
      }

      await this.updateValue()
    },
    async updateValue () {
      this.status = 'Saving...'
      const serverTimestamp = Date.now();
      const blog = cloneDeep(this.blog)

      const id = blog.id
      delete blog.id

      if (!blog.created) {
        blog.created = serverTimestamp
      }

      blog.changed = serverTimestamp

      blog.tags = this.tags.trim() !== '' ? this.tags.split(',').map(item => item.toLowerCase().trim()) : []

      try {
        const promises = []

        const promise1 = this.$fire.firestore.collection('blogs').doc(id).set(blog)
        blog.creatorId = blog.creatorId || this.user.uid
        const teaser = {
          title: blog.title,
          body: blog.teaser || '',
          tags: blog.tags,
          category: blog.category || '',
          subcategory: blog.subcategory || '',
          imageUrl: blog.teaserImageUrl || null,
          imageAlt: blog.imageAlt || '',
          created: blog.created,
          changed: blog.changed,
          creatorId: blog.creatorId,
          published: blog.published || false
        }


        const promise2 = this.$fire.firestore.collection('blogTeasers').doc(id).set(teaser)

        promises.push(promise1, promise2)


        if (this.originalId && this.originalId !== id) {
          const promise3 = this.$fire.firestore.collection('blogs').doc(this.originalId).delete()
          const promise4 = this.$fire.firestore.collection('blogTeasers').doc(this.originalId).delete()

          promises.push(promise3, promise4)
        }


        await Promise.all(promises)

      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('Error saving blog or teaser')
        // eslint-disable-next-line no-console
        console.error(error)
      }

      blog.id = id
      this.$emit('input', cloneDeep(blog))

      this.status = ''
      if (this.originalId !== id) {
        this.originalId = id

        this.$router.replace({
          name: 'blog-id-edit',
          params: {
            id: blog.id
          }
        })
      }
    },
    confirmDelete () {
      // eslint-disable-next-line no-alert
      const result = window.confirm('Are you sure you want to delete this blog?')
      if (result) {
        if (this.originalId) {
          if (this.blog.imageUrl) {
            this.deleteImage();
          }
          const promise1 = this.$fire.firestore.collection('blogs').doc(this.originalId).delete()
          const promise2 = this.$fire.firestore.collection('blogTeasers').doc(this.originalId).delete()

          Promise.all([promise1, promise2])
            .then(() => {
              // eslint-disable-next-line no-alert
              alert('Blog deleted!')
              this.$router.push({
                path: '/admin/blogs'
              })
              return null
            })
            .catch((error) => {
              // eslint-disable-next-line no-alert
              alert('Unable to delete blog!')
              // eslint-disable-next-line no-console
              console.error(error)
            })
        }
      }
    },
    updateId () {
      this.blog.id = this.slugify(this.blog.title)
    },
    async checkExists () {
      const documentSnapshot = await this.$fire.firestore.collection('blogs').doc(this.blog.id).get()
      return documentSnapshot.exists
    },
    /**
     * @see https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
     */
    slugify (string) {
      const a =
        'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
      const b =
        'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
      const p = new RegExp(a.split('').join('|'), 'g')

      return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    },
    launchImageFile () {
      this.$refs.imageFile.click()
    },
    async uploadImageFile (files) {
      if (!files.length) {
        return
      }
      const file = files[0]

      if (!file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image.')
        return
      }
      let fileNameArray = file.name.split('.')
      fileNameArray.pop()
      this.blog.imageAlt = fileNameArray.join();

      const metadata = {
        contentType: file.type
      }

      const fullImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(file, this.FULL_IMAGE.maxDimension, this.FULL_IMAGE.quality, resolve)
      })

      const thumbImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(file, this.THUMB_IMAGE.maxDimension, this.THUMB_IMAGE.quality, resolve)
      })

      const images = await Promise.all([fullImageResizePromise, thumbImageResizePromise])

      const fullImageUploadPromise = this.uploadSingleImageFile(file.name, images[0], metadata)

      const thumbFileName = file.name.substring(0, file.name.lastIndexOf('.')) + '_thumb.' + file.name.substring(file.name.lastIndexOf('.') + 1)
      const thumbImageUploadPromise = this.uploadSingleImageFile(thumbFileName, images[1], metadata)

      this.isUploadingImage = true

      await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
        .then((results) => {
          this.blog.imageUrl = results[0]
          this.blog.teaserImageUrl = results[1]
          return null
        })
        .finally(() => {
          this.updateValue();
          this.isUploadingImage = false
        })
    },
    uploadSingleImageFile (filename, blob, metadata) {
      const storage = this.$fire.storage;
      const imageRef = storage.ref(`blogImages/${this.user.uid}/${filename}`)

      return imageRef.put(blob, metadata).then((snapshot) => {
        // eslint-disable-next-line promise/no-nesting
        return snapshot.ref.getDownloadURL().then((url) => {
          return url
        })
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error uploading image', error)
      })
    },
    generateVariation (file, maxDimension, quality, cb) {
      const displayPicture = (url) => {
        const image = new Image()
        image.src = url
        image.onload = () => {
          const canvas = this.getScaledCanvas(image, maxDimension)
          canvas.toBlob(cb, 'image/jpeg', quality)
        }
      }

      const reader = new FileReader()
      reader.onload = e => displayPicture(e.target.result)
      reader.readAsDataURL(file)
    },
    getScaledCanvas (image, maxDimension) {
      const scaledCanvas = document.createElement('canvas')

      if (image.width > maxDimension || image.height > maxDimension) {
        if (image.width > image.height) {
          scaledCanvas.width = maxDimension
          scaledCanvas.height = (maxDimension * image.height) / image.width
        } else {
          scaledCanvas.width = (maxDimension * image.width) / image.height
          scaledCanvas.height = maxDimension
        }
      } else {
        scaledCanvas.width = image.width
        scaledCanvas.height = image.height
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
        )
      return scaledCanvas
    },
    deleteImage () {
      this.isDeletingImage = true

      const fullImageDeletePromise = this.$fire.storage.refFromURL(this.blog.imageUrl).delete()
      const thumbImageDeletePromise = this.$fire.storage.refFromURL(this.blog.teaserImageUrl).delete()

      return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
        .then(() => {
          this.blog.imageAlt = ''
          this.blog.imageUrl = ''
          this.blog.teaserImageUrl = ''
          return null
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error deleting image', error)

          if (error.code === 'storage/object-not-found') {
            this.blog.imageAlt = ''
            this.blog.imageUrl = ''
            this.blog.teaserImageUrl = ''
          }
        })
        .finally(() => {
          this.updateValue();
          this.isDeletingImage = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.blog-form-options-box {
  position: sticky;
  top: 10px;
  // max-height: calc(100vh - 200px);
  // overflow-y: scroll;
}
</style>

