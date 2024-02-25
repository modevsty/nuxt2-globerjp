<template>
  <div class="faq-component d-flex align-center flex-column" justify="center">
    <div v-if="pageLoaded" class="container-inner d-flex flex-column" justify="center">
      <span class="container-title pa-3">{{pageTitle}}</span>
      <span v-if="noBlogs" class="mb-10">No Contents yet. Coming Soon!</span>
      <v-expansion-panels v-else style="z-index: 0;" flat accordion v-model="openPanel" multiple>
        <v-expansion-panel  v-for="(teaser, index) of blogs" :key="teaser.id">
          <v-expansion-panel-header
            v-bind:id="teaser.id"
            disable-icon-rotate
            ripple
            @click="toggle(index)"
          >
            
            <span class="faq-title">
              <v-icon v-if="open[index]" class="icon minus"
                >mdi-minus-circle-outline</v-icon
              >
              <v-icon v-else class="icon plus">mdi-plus-circle-outline</v-icon>
              <span>
                {{ teaser.title }}
              </span>
            </span>
            <template v-slot:actions>
              <v-icon></v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="expansion-text">
            <!-- <Spinner color="blue" v-if="!teaser.blog"></Spinner> -->
            <div class="expansion-text-inner">
              <blog-details :teaser="teaser" :changed="changed" :prev="null" :next="null" />
              <!-- <span>
                {{ teaser.blog.body }}
              </span> -->
            </div>
            
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn v-if="eof" target="_blank" class="mb-10 primary white--text" :href="`https://docs.google.com/forms/d/e/1FAIpQLSchlVo4KUWEHr2IWrAJ2gVFIVtEchwHyc12bYTYk3jerWtiIw/viewform?usp=pp_url`">Ask us your questions</v-btn>
    </div>
    <Spinner color="blue" v-if="(isLoading && blogs.length)" />
  </div>
</template>
<script>
import BlogDetails from '@/components/BlogDetails'
import faqsJSON from "@/fixtures/faqs.json";
// import LoadingSpinner from '~/components/LoadingSpinner'
import Spinner from '@/components/LoadingSpinner'
export default {
  components: {
    Spinner
  },
  data() {
    return {
      allowBlogLoad: true,
      openPanel: [],
      pageLoaded: false,
      open: [],
      faqs: faqsJSON.faqs,
      teasers: [],
      blogs: [],
      count: 0,
      // category: 'job_hunting',
      eof: false,
      isLoading: false,
      lastDoc: null,
      batchSize: 2,
      changed: '',
      noBlogs: false
    };
  },
  props: {
    category: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    pageTitle: {
      type: String,
      required: true
    }
  },
  async mounted () {
    await this.loadBlogs()
    window.addEventListener('scroll', this.loadMore)
  },
  destroyed () {
    window.removeEventListener('scroll', this.loadMore)
  },
  watch: {
    async $route(to, from, savedPosition) {
      if (to.name.startsWith('faq')){
        // this.pageLoaded = false
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        // this.pageLoaded = true
        setTimeout(() => {
          window.removeEventListener('scroll', this.loadMore)
          window.addEventListener('scroll', this.loadMore)
          this.allowBlogLoad = true
        }, 500)
        
      }
      if (from.name.startsWith('faq')) {
        this.allowBlogLoad = false
        window.removeEventListener('scroll', this.loadMore)
      }
    },
  },
  methods: {
    async launchPanel(index) {
      // await this.addBlog(index);
      // debugger;
      // this.toggle(index);
      // this.$set(open, index, !open[index])
    },
    async loadBlogs () {
      if (this.isLoading || this.eof) {
        return
      }

      this.isLoading = true
      const db = this.$fire.firestore

      // let query = db.collection('blogTeasers')
      //   .where(this.type,'==', this.category)
      //   .where('published', '==', true)
      //   .orderBy('created', 'desc')
      //   .limit(this.batchSize)

        let query = db.collection('blogs')
        .where(this.type,'==', this.category)
        .where('published', '==', true)
        .orderBy('created', 'desc')
        .limit(this.batchSize)

      if (this.lastDoc) {
        query = query.startAfter(this.lastDoc)
      }

      const querySnapshot = await query.get()

      this.eof = querySnapshot.empty

      if (querySnapshot.size > 0) {
        this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

        // for (const doc of querySnapshot.docs) {
        //   this.teasers.push({
        //     id: doc.id,
        //     ...doc.data()
        //   })
        //   this.open.push(false);
        // }
        for (const doc of querySnapshot.docs) {
          this.blogs.push({
            id: doc.id,
            ...doc.data()
          })
          
          this.open.push(true);
          this.openPanel.push(this.count)
          this.count += 1;
        }
        
      }
      if (!this.blogs.length) {
        this.noBlogs = true;
      }

      this.isLoading = false
      this.pageLoaded = true
    },
    loadMore () {
      const elementBounds = this.$el.getBoundingClientRect()

      // Add extra padding to load earlier even before the bottom of the element is in view.
      const padding = 100

      const bottomOfWindow =
        elementBounds.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) + padding

      if (bottomOfWindow && this.allowBlogLoad && !this.isLoading && !this.eof) {
        this.loadBlogs()
      }
    },
    async addBlog(index) {
      if (this.teasers[index].blog) {
        return;
      }
      let query = await this.$fire.firestore.collection('blogs').doc(this.teasers[index].id).get()

      // let query = db.collection('blogs')
      //   .where('category','==', this.category)
      //   .where('published', '==', true)
      //   .orderBy('created', 'desc')
      //   .limit(this.batchSize)

      if (query.exists) {
        this.teasers[index] = {
          ...this.teasers[index],
          blog: {
            id: query.id,
            ...query.data()
          }
        }
        // this.blogs[`${index}`] = {
        //   id: query.id,
        //   ...query.data()
        // }
        this.changed = this.teasers[index].id
      }
      
    },
    toggle(id) {
      this.loadBlogs();
      this.open[id] = !this.open[id];
      this.$forceUpdate();
    },
    accordionClasses(id) {
      if (!this.open[id]) {
        return "is-closed";
      } else {
        return "is-open";
      }
    }
  },
  layout: "home"
};

</script>
<style lang="scss">
  .faq-component {
  h1 {
    margin-bottom: 16px;
  }

  h2 {
    margin-bottom: 16px;
  }

  h3 {
    margin-bottom: 16px;
  }
  }
</style> 
<style lang="scss" scoped>
.container {
  padding: 1rem 20px;
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-inner {
  max-width: 800px;
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container-title {
  font-size: 40px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: center;
  color: #808080;
  padding-bottom: 25px;
  @media screen and (max-width: 800px) {
    font-size: 30px;
  }
}
.icon {
  font-size: 30px;
  margin-right: 22px;
  color: #808080;
}
.faq-title {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.faq-title span {
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  color: #1d90fc;
  @media screen and (max-width: 800px) {
    font-size: 18px;
  }
}
.v-expansion-panel:before {
  box-shadow: none !important;
}
.v-expansion-panel {
  background-color: transparent !important;
}
// .expansion-text .expansion-text-inner {
//   padding: 0 0 16px 52px;
// }

.expansion-text .expansion-text-inner span {
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #808080;
  @media screen and (max-width: 800px) {
    font-size: 16px;
    padding: 0;
  }
}
// .contact-btn {
//   height: 62px !important;
//   width: 246px;
//   background-color: #3e3e3e !important;
//   border-radius: 31px;
//   margin-top: 65px;
// }
// .contact-btn span {
//   font-size: 28px;
//   font-weight: 500;
//   font-stretch: normal;
//   font-style: normal;
//   line-height: 1.25;
//   letter-spacing: normal;
//   text-align: center;
//   color: #fcfcfc;
// }
</style>
