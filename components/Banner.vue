<template>
    <div class="banner-outer">
      <div
      @mouseover="stopTimer" @mouseleave="restartTimer"
        v-if="news.length"
        id="banner-box"
        class="yellow-banner pa-3"
      >
        <div v-if="autoSlideInterval && showProgressBar" class="progressbar">
          <div :style="{ width: progressBar + '%' }"></div>
        </div>
        <div class="banner-inner text-body-1">
           <v-spacer />
          <span v-html="news[index] && news[index].alteredContent" class="banner-text font-weight-medium">
          </span>
            <span id="cross-menu" @click="toggleBanner()">
              <v-icon class="pl-5 font-weight-bold white--text">mdi-close</v-icon>
            </span>
        </div>
      </div>
    </div>
      <!-- <v-banner single-line class="primary white--text">
        {{ news[0] && news[0].content }}
        <template v-slot:actions="{ dismiss }">
            <v-btn
              text
              color="primary"
              @click="dismiss"
            >
              <v-icon class="pl-5 font-weight-bold white--text">mdi-close</v-icon>
            </v-btn>
        </template>
      </v-banner> -->


</template>
<script>
export default {
  data() {
    return {
      news: [],
      index: 0,
      showProgressBar: true,
      autoSlideInterval: 10000,
      autoSlideTimeout: null,
      // If the timer is stopped e.g. when hovering over the carousel
      stopSlider: false,
      // Hold the time left until changing to the next image
      timeLeft: 0,
      // Hold the interval so we can clear it when needed
      timerInterval: null,
      // Every 10ms decrease the timeLeft
      countdownInterval: 10
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === 'index') {
        await this.getData();
        if (
        this.autoSlideInterval &&
        this.autoSlideInterval > this.countdownInterval
        ) {
          this.stopTimer()
          this.restartTimer()
          // Start the timer to go to the next image
          // this.startTimer(this.autoSlideInterval);
          // this.timeLeft = this.autoSlideInterval;
          // // Start countdown to show the progressbar
          // this.startCountdown();
        }
      }
    },
  },
  async mounted() {
    await this.getData()
    if (
      this.autoSlideInterval &&
      this.autoSlideInterval > this.countdownInterval
    ) {
      // Start the timer to go to the next image
      this.startTimer(this.autoSlideInterval);
      this.timeLeft = this.autoSlideInterval;
      // Start countdown to show the progressbar
      this.startCountdown();
    }
  },
  
  computed: {
    progressBar() {
      // Calculate the width of the progressbar
      return 100 - (this.timeLeft / this.autoSlideInterval) * 100;
    },
  },
  methods: {
    startCountdown() {
      if (!this.showProgressBar) return;
      const self = this;
      this.timerInterval = setInterval(function() {
        self.timeLeft -= self.countdownInterval;
        if (self.timeLeft <= 0) {
          self.timeLeft = self.autoSlideInterval;
          self.changeIndex();
        }
      }, this.countdownInterval);
    },
    startTimer(interval) {
      if (interval && interval > 0 && !this.stopSlider) {
        const self = this;
        clearTimeout(this.autoSlideTimeout);
        this.autoSlideTimeout = setTimeout(function() {
          // console.log(self.progressbar, self.timeLeft)
          self.startTimer(self.autoSlideInterval);
        }, interval);
      }
    },
    stopTimer() {
      clearTimeout(this.autoSlideTimeout);
      this.stopSlider = true;
      clearInterval(this.timerInterval);
    },
    // Restart the timer(with 'timeLeft') when leaving from the carousel
    restartTimer() {
      this.stopSlider = false;
      clearInterval(this.timerInterval);
      this.startCountdown();
      this.startTimer(this.timeLeft);
    },
    changeIndex() {
      this.index = (this.index + 1) % (this.news.length);
    },
    async getData() {
      const news = this.$fire.firestore.collection('news')
      .where('isPublished','==',true)
      .orderBy('createdAt', 'desc')
      const querySnapShot = await news.get()
      const out = []
      if (querySnapShot.size > 0) {
        querySnapShot.forEach((doc) => {
          let id = doc.id
          let data = doc.data()
          let alteredContent = ''
          if (data.content) {
            alteredContent = this.replaceUrls(data.content)
          }
          // if (data.content) {
          //   let match = data.content.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
          //   alteredContent=data.content;
          //   if (match) {
          //     match.map(url=>{
          //       alteredContent=alteredContent.replace(url,"<a style='color:blue !important' href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
          //     })
          //   }
          // }
          out.push({
            id,
            ...data,
            alteredContent
          })
        })
      }
      this.news = out
    },
    replaceUrls(string) {
      const urlRegex = /href="([^\'\"]+)/g
      return string? string.replace(urlRegex, (url) => {
        return (
          ' target="_blank" ' + url
        )
      }) : ''
    },
    toggleBanner() {
      const bannerBox = document.getElementById("banner-box");
      bannerBox.style.display = "none";
    },
  }
}
</script>
<style scoped>
.progressbar {
  display: block;
  top: 0;
  width: 100%;
  height: 5px;
  position: absolute;
  background-color: #64BDDC;
  z-index: 1;
}

.progressbar > div {
  background-color: #1976d2;
  height: 100%;
}

</style>
<style lang="scss">
.banner-outer {
  z-index: 4;
  position: sticky;
  top: 0;
  width: 100%;
  max-height: 65px;
  overflow: visible;
}
  .yellow-banner {
      display: flex;
    min-height: 65px;
    justify-content: center;
    align-items: center;
    background-color: #64BDDC;
    opacity: 0.97;
    .banner-inner {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      .banner-text {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Roboto;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.38;
        letter-spacing: normal;
        text-align: left;
        // color: #454343;
        color: white;
        #cross-menu {
          padding: 5px 10px 5px 40px;
          font-size: 24px;
          color: grey;
        }
        p {
          margin-bottom: 0;
        }
        a {
          // color: #2569AC;
          color: #1976d2;
          margin-bottom: 0;
        }
        strong {
          // color: #D1D622;
          color: yellow;
          // color: #2569AC;
        }
        span {
          margin-bottom: 0;
        }
      }
    }
  }
</style>