<template >
  <Spinner style="position: fixed; top: 60px; left:0; right:0; margin: auto;" color="blue"/>
</template>
<script>
import Spinner from '@/components/LoadingSpinner'
  export default {
    components: {
      Spinner
    },
    middleware({ store, route, redirect }) {
      if( process.browser) {
         setTimeout(()=>{
          $nuxt.$router.replace({path:`/chat`}).catch(()=>{});
        },200)
      }
    },
    mounted() {
      this.$router.replace({path:`/chat`}).catch(()=>{});
    }
  }
</script>