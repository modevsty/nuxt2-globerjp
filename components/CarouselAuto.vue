<template>
  <div class="card-carousel">
    <client-only>
      <div v-if="autoSlideInterval && showProgressBar" class="progressbar">
        <div :style="{ width: progressBar + '%' }"></div>
      </div>
      <swiper ref="swiper" :options="fullscreen? {...swiperOptions, autoplay: { delay: 6000,disableOnInteraction: false },  speed: 1000,spaceBetween: 1000} : {...swiperOptions, spaceBetween: 30}" @transitionEnd="onSlideChange">
        <swiper-slide :class="[images.length==1 || fullscreen?'mb-0':'mb-5']"  v-for="(image, index) in filteredImages" :virtualIndex="index" :key="index">
          <div class="card-img"  style="overflow:hidden;" :style="fullscreen? {
            height: '90vh'
          }:{}">
          <v-img
            transition="xxx"
            :key="'main-img-'+index"
            :lazy-src="lazyGif"
            :ref="'main-img-'+index"
            :eager="(index===0 || postId)?true:eager"
            contain
            :src="imgFailed? lazyGif:image.imageUrl"
            @error="imgErrorHandler(index)"
            class="main-img"
            alt=""
          />
          </div>
        </swiper-slide>
      </swiper>
        <!-- <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div> -->
    </client-only>
    <GridCarousel v-if="!hideGrid" v-model="activeImage" :filteredImages="filteredImages" :eager="eager" :postId="postId" :thumbnailWidth="thumbnailWidth"/>
    <!-- <div class="d-flex justify-center align-center">
      <div v-if="filteredImages.length > 1" class="d-flex justify-center align-center" :style="`width:min(${this.thumbnailWidth || '500'}px,100%);padding: 0 10px;`"> 
        <div v-dragscroll @dragscrollstart="start"
            @dragscrollend="end"
            @click.capture="click" class="sp-none thumbnails">
          <div
            v-for="(image, index) in filteredImages"
            :key="index"
            :class="['thumbnail-image', activeImage == index ? 'active' : '']"
            @click="transitionImage(index)"
          >
            <div class="thumb-img-outer">
              <v-img
                transition="xxx"
                :src="imgFailed? lazyGifSmall:image.teaserImageUrl"
                class="thumb-img"
                :eager="postId? true: eager"
                :lazy-src="lazyGifSmall"
                @error="imgErrorHandler(index)"
              />
            </div>
          </div>
        </div>
        <div class="thumbnails pc-none">
          <div
            v-for="(image, index) in filteredImages"
            :key="index"
            :class="['thumbnail-image', activeImage == index ? 'active' : '']"
            @click="transitionImage(index)"
          >
            <div class="thumb-img-outer">
              <v-img
                transition="xxx"
                :src="imgFailed? lazyGifSmall:image.teaserImageUrl"
                class="thumb-img"
                :eager="postId? true: eager"
                :lazy-src="lazyGifSmall"
                @error="imgErrorHandler(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import GridCarousel from '@/components/GridCarousel.vue'
export default {
  name: 'Carousel',
  props: ['fullscreen','autoSlideInterval','hideGrid','isVisibleObject','startingImage', 'resizedImages','images', 'showProgressBar', 'thumbnailWidth', 'eager','portrait','postId'],
  components: {
    GridCarousel
  },
  data() {
    return {
      swiperOptions: {
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // },
        // pagination: {
        //     el: '.swiper-pagination',
        // },
        centeredSlides: true,
        grabCursor: true,
        effect: 'coverflow',
        slidesPerView: 'auto',
        touchRatio: 1,
        freeMode: false,
        freeModeSticky: true,
        // mousewheel: true,
        // slideToClickedSlide: true,
        // scrollbar: {
        //   el: ".swiper-scrollbar",
        //   draggable: true,
        //   dragSize: 40,
        // },
        // pagination: {
        //             el: ".swiper-pagination",
        //   type: "fraction",
        //   dynamicBullets: true
        // }
      },
      // lazyGif2: 'data:image/gif;base64,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',
      lazyGif: 'data:image/gif;base64,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',
      lazyGifSmall: 'data:image/gif;base64,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',
      dragging: false,
      timer: null,
      imgFailed:false,
      carouselImages: [],
      timeOut: null,
      timeOutInner: null,
      timeOutOuter: null,
      // Index of the active image
      activeImage: 0,
      // Hold the timeout, so we can clear it when it is needed
      autoSlideTimeout: null,
      // If the timer is stopped e.g. when hovering over the carousel
      stopSlider: false,
      // Hold the time left until changing to the next image
      timeLeft: 0,
      // Hold the interval so we can clear it when needed
      timerInterval: null,
      // Every 10ms decrease the timeLeft
      countdownInterval: 10
    };
  },
  computed: {
    filteredImages() {
      return this.carouselImages.filter(e => e.imageUrl)
    },
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 500) ? false : true 
      }
      return true
    },
    // currentImage gets called whenever activeImage changes
    // and is the reason why we don't have to worry about the
    // big image getting updated
    currentImage() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.timeLeft = this.autoSlideInterval;
      if (!this.images[this.activeImage]) return '/img/image-not-found.png';
      //change to .imageUrl for better quality images
      return this.images[this.activeImage];
    },
    progressBar() {
      // Calculate the width of the progressbar
      return 100 - (this.timeLeft / this.autoSlideInterval) * 100;
    }
  },
  watch: {
    isVisibleObject: {
      async handler(val) {
        if (
          val && !val.value
        ) {
          this.activeImage = 0;
          if (this.$refs.swiper) {
             this.$refs.swiper.swiperInstance.slideTo(this.activeImage,0,false)
          }
         
        }
        this.imgFailed = false;
      },
      deep: true,
      immediate: true
    },
    activeImage(val) {
      let timing = 400;
      if (this.isMobileScreen) {
        timing = 300;
      }
      this.$nextTick(() => {
        this.$refs.swiper.swiperInstance.slideTo(val,timing,false)
      })
       
    },
    images: {
      async handler(val) {
        this.carouselImages = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
     if (
      this.autoSlideInterval &&
      this.autoSlideInterval > this.countdownInterval
    ) {
      this.startTimer(this.autoSlideInterval);
      this.timeLeft = this.autoSlideInterval;
      this.startCountdown();
    }
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
      console.log(this.activeImage)
      this.activeImage = (this.activeImage + 1) % (this.filteredImages.length);
    },
    onSlideChange() {
      const index = this.$refs.swiper.swiperInstance.snapIndex
      this.$nextTick(() =>{
         if (index !== this.activeImage) {
          this.activeImage = index
        }
      })
     
    },
    imgErrorHandler(index) {
      if (index !== 0) {
        this.carouselImages[index].imageUrl = '';
        this.carouselImages[index].teaserImageUrl = '';
      } else {
        if (!this.imgFailed) {
          this.carouselImages.forEach((e, index) => {
            if (index !== 0) {
              e.imageUrl = '';
              e.teaserImageUrl = '';
            }
          })
          this.imgFailed=true
        }
      }
    },
    start() {
      this.timer = setTimeout(() => (this.dragging = true), 100);
    },
    end() {
      clearTimeout(this.timer);
      setTimeout(() => (this.dragging = false));
    },
    click(event) {
      if (this.dragging) {
        event.stopPropagation();
      }
    },
    
    transitionImage(newImageIndex) {
      this.activeImage = newImageIndex
      let timing = 400;
      if (this.isMobileScreen) {
        timing = 300;
      }
      this.$refs.swiper.swiperInstance.slideTo(this.activeImage,timing,false)
      // this.mySwipe.slide(newImageIndex, timing)
      this.$forceUpdate()
      
    },
  }
};
</script>

<style lang="scss">
  .swiper-pagination {
   
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 100px;
  }

.visible {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}
.thumbnail-image:hover,
.thumbnail-image.active {
  .v-image__image {
    opacity: 0.6;
    box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.5);
  }
}
</style>
<style scoped>
::-webkit-scrollbar {
  height: 7px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background: #eeeeee;
  border-radius: 14px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 14px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.card-carousel {
  user-select: none;
  position: relative;
  width: 100%;
  /* max-width: 400px; */
}

.progressbar {
  display: block;
  width: 100%;
  height: 5px;
  position: absolute;
  background-color: rgba(221, 221, 221, 0.25);
  z-index: 1;
}

.progressbar > div {
  background-color: rgba(255, 255, 255, 0.52);
  height: 100%;
}

.thumbnails {
  display: flex;
  flex-direction: row;
  overflow-x: overlay;
  overflow-y: hidden;
}

.thumbnail-image {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 3px 9px;
}
.thumbnail-image:first-child {
  padding-left: 0
}
.thumbnail-image:last-child {
  padding-right: 0
}

.thumbnail-image > img {
  width: 100px;
  height: auto;
  transition: all 250ms;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-img-outer {
  width: 120px;
  height: 70px;
}

/* .main-img {
  width: 100%;
  height: 100%;
} */

.card-img {
  position: relative;

}

.card-img > .v-image {
  position: absolute;
}

.card-img > img {
  /* display: block; */
  display: inline;
  margin: 0 auto;
}

.portrait-card-img {
  position: relative;
}

.portrait-card-img > .v-image {
  position: absolute;
}

.portrait-card-img > img {
  /* display: block; */
  display: inline;
  margin: 0 auto;
}

.actions {
  font-size: 1.5em;
  height: 40px;
  position: absolute;
  top: 50%;
  margin-top: -20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #585858;
}

.actions > span {
  cursor: pointer;
  transition: all 250ms;
  font-size: 45px;
}

.actions > span.prev {
  margin-left: 5px;
}

.actions > span.next {
  margin-right: 5px;
}

.actions > span:hover {
  color: #eee;
}
</style>

<style lang="scss" scoped>
.sp-none {
  @media screen and (max-width: 599px) {
    display:none !important;
  }
}
.pc-none {
  @media screen and (min-width: 600px) {
    display:none !important;
  }
}
.blur-img {
  filter: blur(0px);
}
.old-img {
  width: 100%;
  height: 100%;
  position: absolute;
}
.main-img {
  // animation: createBox .99s;
  // width: 98px; height: 98px;
  // width: 100%;
  height: 100%;
  width: 100%;
  // @media screen and (max-width: 800px) {
  //   height: min(350px, 100%);
  //   width: 100%;
  //   // width: 100%;
    
  // }
  // @media screen and (min-width: 801px) {
  //   height: 400px;
  //   max-width: 100%;
  //   // width: 100%;
    
  // }
}

.card-img {
  @media screen and (max-width: 800px) {
    // height: calc(75vw - 20px);
    // max-width: 100%;
    height: 400px;
    max-width: 100%;
    // width: 100%;
    
  }
  @media screen and (max-width: 500px) {
    height: calc(75vw - 20px);
    max-width: 100%;
    // width: 100%;
    
  }
  @media screen and (min-width: 801px) {
    height: 420px;
    max-width: 100%;
    // width: 100%;
    
  }
}

.portrait-card-img {
  @media screen and (max-width: 800px) {
    // height: calc(75vw - 20px);
    // max-width: 100%;
    height: 400px;
    max-width: 100%;
    // width: 100%;
    
  }
  @media screen and (max-width: 500px) {
    height: calc(131vw - 20px);
    max-width: 100%;
    // width: 100%;
    
  }
  @media screen and (min-width: 801px) {
    height: 420px;
    max-width: 100%;
    // width: 100%;
    
  }
}

// .create-image-left {
//     animation: createBoxLeft 40s !important;
// }

// .delete-image-left {
//     animation: deleteBoxLeft 40s !important;
// }

// @keyframes createBoxLeft {
//   from {
//     transform: translateX(-130%);
//     // transform: scale(0.3);
//   }
//   to {
//     transform: translateX(0);
//     // transform: scale(1);
//   }
// }

// @keyframes deleteBoxLeft {
//   from {
//     transform: translateX(0);
//     // transform: scale(0.3);
//   }
//   to {
//     transform: translateX(130%);
//     // transform: scale(1);
//   }
// }

// .create-image-right {
//     animation: createBoxRight 40s !important;
// }

// .delete-image-right {
//     animation: deleteBoxRight 40s !important;
// }

// @keyframes createBoxRight {
//   from {
//     transform: translateX(130%);
//     // transform: scale(0.3);
//   }
//   to {
//     transform: translateX(0);
//     // transform: scale(1);
//   }
// }

// @keyframes deleteBoxRight {
//   from {
//     transform: translateX(0);
//     // transform: scale(0.3);
//   }
//   to {
//     transform: translateX(-130%);
//     // transform: scale(1);
//   }
// }
</style> 
