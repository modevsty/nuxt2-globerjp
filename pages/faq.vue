<template>
  <div style="width:100%;height: 100%;background-color:white;">
    <div class="spinner-container" v-if="!isLoaded">
        <GloberSpinner class="top-spinner"></GloberSpinner>
    </div>
    <div v-else>
      <div style="position: absolute; height: 100%;" class="sp-none">
        <client-only>
          <v-navigation-drawer
            :mini-variant="mini"
            :expand-on-hover="mini"
            width="280"
            class="navigation-drawer-pc"
          >
            <v-list>
              <v-list-item-group
              >
                <div v-for="(item, i) in items" :key="i">
                  <v-list-item
                      v-if="!item.subItems"
                      :key="i" 
                      nuxt :to="{ name: item.to }">
                    <v-list-item-icon>
                      <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{item.title}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-group
                    sub-group
                    :key="item.id"
                    v-else
                    :value="openList"
                
                  >
                    <template v-slot:activator>
                      <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                      </v-list-item-icon>
                    
                      <v-list-item-content>
                        <v-list-item-title>{{item.title}}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item
                  
                      v-for="(subItem, j) in item.subItems" 
                      :key="j"
                      nuxt :to="{ name: subItem.to }">
                      <v-list-item-icon>
                        <v-icon>{{subItem.icon}}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{subItem.title}}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </div>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </client-only>
      </div>
      <v-row v-if="error || success">
        <v-col>
          <v-card>
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
            <v-alert v-if="success" type="success">{{ success }}</v-alert>
          </v-card>
        </v-col>
      </v-row>
      <v-btn
        fab
        fixed
        right
        bottom
        large
        @click="()=>{drawer = !drawer}"
        class="v-btn-float"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <!-- <v-app-bar app clipped-right>
        <v-app-bar-nav-icon />
      </v-app-bar> -->
      <div>
        <!-- <div><h1 style="color:red; text-align:center;">Only admin can see this page currently.</h1></div> -->
        <NuxtChild />
      </div>
      <v-navigation-drawer
          v-if="isLoaded"
          v-model="drawer"
          style="margin-top:0"
          width="280"
          class="navigation-drawer-sp"
        >
          <v-list>
            <v-list-item-group
            >
              <div v-for="(item, i) in items" :key="i">
                <v-list-item
                    v-if="!item.subItems"
                    :key="i" 
                    nuxt :to="{ name: item.to }">
                  <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{item.title}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-group
                  sub-group
                  :key="item.id"
                  v-else
                  :value="openList"
                >
                  <template v-slot:activator>
                      <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                      </v-list-item-icon>
                    
                      <v-list-item-content>
                        <v-list-item-title>{{item.title}}</v-list-item-title>
                      </v-list-item-content>
                  </template>
                  <v-list-item 
                    v-for="(subItem, j) in item.subItems" 
                    :key="j"
                    nuxt :to="{ name: subItem.to }">
                    <v-list-item-icon>
                      <v-icon>{{subItem.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{subItem.title}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </div>
            </v-list-item-group>
          </v-list>
      </v-navigation-drawer>
    </div>
    
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import { ACCOUNT_ID, CATEGORY } from "~/store/account/types";
import Spinner from '@/components/LoadingSpinner'
import GloberSpinner from '@/components/GloberSpinner'
export default {
  components: {
    Spinner,
    GloberSpinner
  },
  data() {
    return {
      isLoaded: false,
      openList: true,
      isMounted: false,
      drawer: false,
      miniSize: false,
      error: "",
      success: "",
      items: [
        {
            to     : 'faq-immigration_related',
            icon   : 'mdi-passport',
            title   : 'Immigration Related',
        },
        {
            to     : 'faq-job_hunting',
            icon   : 'mdi-briefcase',
            title   : 'Job Hunting',
        },
        {
            to     : 'faq-parttime_jobs',
            icon   : 'mdi-human-dolly',
            title   : 'Part-time Jobs',
        },
        {
            to     : 'faq-housing',
            icon   : 'mdi-home-group',
            title   : 'Housing',
        },
        {
            to     : 'faq-scholarship',
            icon   : 'mdi-account-school',
            title   : 'Scholarship',
        },
        {
            icon     : 'mdi-ideogram-cjk',
            title     : 'Life in Japan',
            subItems : [
                {
                  to     : 'faq-daily_life_in_japan-banking',
                  icon   : 'mdi-bank-outline',
                  title   : 'Banking',
                },
                {
                  to     : 'faq-daily_life_in_japan-garbage_and_recycling',
                  icon   : 'mdi-recycle',
                  title   : 'Garbage and Recycling',
                },
                // {
                //   to     : 'faq-daily_life_in_japan-phone_and_post_office',
                //   icon   : 'mdi-cellphone-sound',
                //   title   : 'Phone and Post Office',
                // },
                // {
                //   to     : 'faq-daily_life_in_japan-transportation',
                //   icon   : 'mdi-train-car',
                //   title   : 'Transportation',
                // },
                // {
                //   to     : 'faq-daily_life_in_japan-insurance_and_national_pension',
                //   icon   : 'mdi-hand-heart',
                //   title   : 'Insurance and Pension',
                // },
                {
                  to     : 'faq-daily_life_in_japan-medical_related',
                  icon   : 'mdi-medical-bag',
                  title   : 'Medical Related',
                },
            ]
        },
        {
            icon     : 'mdi-biathlon',
            title     : 'Leisure',
            subItems : [
                {
                  to     : 'faq-leisure-food',
                  icon   : 'mdi-hamburger',
                  title   : 'Food',
                },
                {
                  to     : 'faq-leisure-traveling',
                  icon   : 'mdi-airplane',
                  title   : 'Traveling',
                },
                // {
                //   to     : 'faq-leisure-extra_curricular_activities',
                //   icon   : 'mdi-run-fast',
                //   title   : 'Extra Curricular Activities',
                // },
            ]
        },
    ]
    };
  },
  // watch: {
  //   group (val, old) {
  //     debugger;
  //     this.drawer = false
  //   },
  // },
  // methods: {
  //   minimize() {
  //     if (process.browser){
  //       if (window.innerWidth < 800) {
  //         return false
  //       } else {
  //         return true
  //       }
  //     }
  //   },
  // },
  mounted() {
    window.addEventListener('resize', this.getHeight);
    this.isMounted=true;
    setTimeout(() => {
      this.isLoaded = true
    },1000)
  },
  destroyed() {
    if ( process.browser) {
      window.removeEventListener('resize', this.getHeight);
      this.isMounted = false;
    }
  },
  methods: {
    getHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh',`${vh}px`);
    }
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 900) ? false : true 
      }
      return true
    },
    mini() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return false
        case 'sm': return true
        case 'md': return true
        case 'lg': return true
        case 'xl': return true
      }
    }
  },
  middleware({ redirect, route, store }) {
    if (route.name === "faq") {
      redirect({ ...route, name: "faq-immigration_related" });
      
    }
  },
};
</script>
<style lang="scss">
.v-list-group__header {
  padding-left: 16px !important;
  .v-list-group__header__prepend-icon {
  position: absolute;
  right: 0;
}
  .v-list-item__icon {
    padding-right: 32px;
    i {
      font-size: 24px;
    }
  }
}

.navigation-drawer-pc {
  .v-list-group__header {
    color: rgba(0,0,0,0.54) !important;
    .v-list-item__icon {
      i {
        color: rgba(0,0,0,0.54) !important;
      }
    }
    .v-list-item__content {
      div {
        color: rgba(0,0,0,0.87) !important;
      }
    }
  }
}
.navigation-drawer-sp {
  .v-list-group__header {
    color: rgba(0,0,0,0.54) !important;
    .v-list-item__icon {
      i {
        color: rgba(0,0,0,0.54) !important;
      }
    }
    .v-list-item__content {
      div {
        color: rgba(0,0,0,0.87) !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.spinner-container {
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  height: 100svh;

  .top-spinner {
    margin-top: -80px !important; 
    height: fit-content;
    width: fit-content;
  }
}
.sp-none {
      @media screen and (max-width: 900px) {
      display: none;
    }
}
  .navigation-drawer-pc {
    z-index: 4;
    @media screen and (max-width: 900px) {
      display: none;
    }

    background-color: rgb(240,240,240) !important;
    visibility: initial;
    position:sticky; 
    transform: translateX(0%) !important;
    max-height: calc(var(--vh, 1vh) * 100 - 56px) !important;
    .v-list {
      max-height: calc(var(--vh, 1vh) * 100 - 56px);
    }
    // .group-activator {
    //   color: black !important;
    // }
    .v-list-item  {
      color: black;
      // .v-list-item__title {
      //     color: black !important;
      // }
      
    }
    .v-list-item--active {
      color: #1976d2;
      // .v-list-item__title {
      //   color: #1976d2 !important;
      // }
    }
  }
  .navigation-drawer-sp {
    @media screen and (min-width: 901px) {
      display: none;
    }
    background-color: rgb(240,240,240) !important;
    visibility: initial;
    position: fixed;
    padding-top: 56px !important;
    padding-bottom: 56px !important;
    .v-list {
      max-height: calc(100vh);
      max-height: calc(var(--vh, 1vh) * 100);

    }
    .v-list-item  {
      color: black;
      // .v-list-item__title {
      //     color: black;
      // }
      
    }
    .v-list-item--active {
      color: #1976d2;
      // .v-list-item__title {
      //   color: #1976d2;
      // }
    }
    // @media screen and (min-width: 801px) {
    //   position:sticky; 
    //   transform: translateX(0%) !important;
    //   max-height: calc(100vh) !important;
    // }
  }
  .v-btn-float {
    margin: 60px 10px;
    color: rgb(100,100,100);
    @media screen and (min-width: 901px) {
      display: none;
    }
  }
</style>
