import colors from 'vuetify/es5/util/colors'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: ' %s',
    title: 'glober | home in the world',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Event Sharing Site for Students' },
      { hid: 'canonical', rel: 'canonical', content: 'https://globerjp.com' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:title', property: 'og:title', content: 'glober - home in the world' },
      { hid: 'og:url', property: 'og:url',  content: 'https://globerjp.com' },
      { hid: 'og:type', property: 'og:type',  content: 'website' },
      { hid: 'og:description', property: 'og:description', content: 'Event Sharing Site for Students' },
      { hid: 'og:image', property: 'og:image', content: "https://globerjp.com/img/glober.jpg" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // Iconfonts for Vuetify. You need to leave only which one you use
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' },
      // { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.4.95/css/materialdesignicons.min.css' }
    ]
  },
  // env: {
  //   apiKey: process.env.API_KEY || '',
  //   clientId: process.env.CLIENT_ID || ''
  // },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-dragscroll', ssr: false},
    {src: '~/plugins/to-date', mode: 'client'},
    { src: '~/plugins/TiptapVuetify', mode: 'client' },
    { src: '~/plugins/TiptapElement', mode: 'client' },
    { src: '~/plugins/vue-cropper', mode: 'client' },
    {src: '@/plugins/vueVirtualScroller', mode: 'client'},
    { src: "~/plugins/observeVisibility", ssr: false },
    {src: '@/plugins/vue-poll', mode: 'client'},
    {src: '@/plugins/vue-json-to-csv'},
    { src: '~/plugins/VueAwesomeSwiper.js', mode: 'client' },
    {src: '~/plugins/VueAdvancedChat.js', mode: 'client'},
    // {src: '@/plugins/vueDisableBodyScroll.js', mode: 'client'}
    // { src: '~/plugins/rememberScrollPosition', mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@braid/vue-formulate/nuxt',
    // '~/modules/material-design-icons.js'
    // '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/firebase','@nuxtjs/moment'],
  firebase: {
    // options
    config: {
      apiKey: process.env.NODE_ENV == 'production' ? process.env.API_KEY: process.env.DEV_API_KEY,
      authDomain: process.env.NODE_ENV == 'production' ? process.env.AUTH_DOMAIN : process.env.DEV_AUTH_DOMAIN,
      projectId: process.env.NODE_ENV == 'production' ? process.env.PROJECT_ID : process.env.DEV_PROJECT_ID,
      storageBucket: process.env.NODE_ENV == 'production' ? process.env.STORAGE_BUCKET : process.env.DEV_STORAGE_BUCKET,
      messagingSenderId: process.env.NODE_ENV == 'production' ? process.env.MESSAGE_SENDER_ID : process.env.DEV_MESSAGE_SENDER_ID,
      appId: process.env.NODE_ENV == 'production' ? process.env.APP_ID : process.env.DEV_APP_ID,
      measurementId: process.env.NODE_ENV == 'production' ? process.env.MEASUREMENT_ID : process.env.MEASUREMENT_ID
    },
    services: {
      analytics: true,
      auth: {
        persistence: 'local',
        initialize: {
          // onAuthStateChangedMutation: 'onAuthStateChangedMutation',
          onAuthStateChangedAction: 'onAuthStateChanged',
        },
        ssr: true
      },
      firestore: true,
      storage: true
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3
      //   }
      // }
      dark: false,
      themes: {
        light: {
          jgreyest: '#595959',
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.blue.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: [
        'vue-cropperjs'
    ],
    transpile: ['vuetify/lib', "tiptap-vuetify"]
  }
}
