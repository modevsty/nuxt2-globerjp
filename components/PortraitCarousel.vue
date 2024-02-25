<template>
  <div @mouseover="stopTimer" @mouseleave="restartTimer" class="card-carousel">
    <div v-if="autoSlideInterval && showProgressBar" class="progressbar">
      <div :style="{ width: progressBar + '%' }"></div>
    </div>
    <div :class="['card-img',images.length==1?'mb-0':'']"  style="overflow:hidden;">
      <v-img
        v-for="(image, index) in images"
        :key="index"
        :ref="'main-img-'+index"
        :eager="index===0?true:eager"
        contain
        v-show="activeImage == index? true: false"
        :src="imgFailed? '/img/image-not-found.png':image.imageUrl"
        @error="imgFailed=true"
        :class="['main-img',images.length==1?'mb-0':'']"
        alt=""
      />
      <!-- <div class="actions">
        <span @click="prevImage" class="prev">
          &#8249;
        </span>
        <span @click="nextImage" class="next">
          &#8250;
        </span>
      </div> -->
    </div>
    <div class="d-flex justify-center align-center">
      <div v-if="images.length > 1" class="d-flex justify-center align-center" :style="`width:min(${this.thumbnailWidth || '500'}px,100%);padding: 0 10px;`"> 
        <div v-if="!isMobileScreen" v-dragscroll @dragscrollstart="start"
            @dragscrollend="end"
            @click.capture="click" class="thumbnails">
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="['thumbnail-image', activeImage == index ? 'active' : '']"
            @click="transitionImage(index)"
          >
            <div class="thumb-img-outer">
              <v-img
                :src="imgFailed? '/img/image-not-found.png':image.teaserImageUrl"
                class="thumb-img"
                @error="imgFailed=true"
                :eager="eager"
              />
            </div>
          </div>
        </div>
        <div v-else class="thumbnails">
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="['thumbnail-image', activeImage == index ? 'active' : '']"
            @click="transitionImage(index)"
          >
            <div class="thumb-img-outer">
              <v-img
                :src="imgFailed? '/img/image-not-found.png':image.teaserImageUrl"
                class="thumb-img"
                :eager="eager"
                @error="imgFailed=true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: ['startingImage', 'images', 'autoSlideInterval', 'showProgressBar', 'thumbnailWidth', 'eager'],
  data() {
    return {
      dragging: false,
      timer: null,
      imgFailed:false,
      timeOut: null,
      timeOutInner: null,
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
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 800) ? false : true 
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
  created() {
    // Check if startingImage prop was given and if the index is inside the images array bounds
    if (
      this.startingImage &&
      this.startingImage >= 0 &&
      this.startingImage < this.images.length
    ) {
      this.activeImage = this.startingImage;
    }

    // Check if autoSlideInterval prop was given and if it is a positive number
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
  methods: {
    // onDragsStart() {
    //   clearTimeout(this.dragTimeout);

    //   this.dragged = false;
    //   this.dragTimeout = setTimeout(() => { this.dragged = true; }, 100);
    // },
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

    // onDragClick() {
    //   setTimeout(() => { this.dragged = false; }, 100);
    // },
    // Go forward on the images array
    // or go at the first image if you can't go forward
    nextImage() {
      let active = this.activeImage + 1;
      if (active >= this.images.length) {
        active = 0;
      }
      this.activateImage(active);
    },
    // Go backwards on the images array
    // or go at the last image
    prevImage() {
      let active = this.activeImage - 1;
      if (active < 0) {
        active = this.images.length - 1;
      }
      this.activateImage(active);
    },
    activateImage(imageIndex) {
      this.activeImage = imageIndex;
    },
    transitionImage(newImageIndex) {
      const oldImageIndex = this.activeImage;
      const timing = 250;

      if (newImageIndex < oldImageIndex) {
        this.transitionRight(newImageIndex, oldImageIndex, timing);
      } else if (newImageIndex > oldImageIndex) {
        this.transitionLeft(newImageIndex, oldImageIndex, timing);
      }
      
    },
    transitionLeft(newImageIndex, oldImageIndex, timing) {
      clearTimeout(this.timeOut);
      clearTimeout(this.timeOutInner);
      const oldTransition = [
        { transform: 'translateX(0)'},
        { transform: 'translateX(-100%)' }
      ];
      const newTransition = [
        { transform: 'translateX(150%)'},
        { transform: 'translateX(0)' }
      ];
      
      const oldTiming = {
        duration: timing,
        iterations: 1,
      }
      const newTiming = {
        duration: timing*1.5,
        iterations: 1,
      }

      let oldElem = this.$refs[`main-img-${oldImageIndex}`]
      oldElem.lastItem.$el.animate(oldTransition, oldTiming)
      // oldElem.lastItem.$el.animate(oldTransition, oldTiming)
      this.timeOut = setTimeout(()=>{
        let newElem = this.$refs[`main-img-${newImageIndex}`]
        newElem.lastItem.$el.animate(newTransition, newTiming)
      }, timing - 60)
      this.timeOutInner = setTimeout(()=> {
        this.activateImage(newImageIndex)
      }, timing - 30)
    },
    transitionRight(newImageIndex, oldImageIndex, timing) {
      clearTimeout(this.timeOut);
      clearTimeout(this.timeOutInner);
      const oldTransition = [
        { transform: 'translateX(0)'},
        { transform: 'translateX(100%)' }
      ];
      const newTransition = [
        { transform: 'translateX(-150%)'},
        { transform: 'translateX(0)' }
      ];
      const oldTiming = {
        duration: timing,
        iterations: 1,
      }
      const newTiming = {
        duration: timing*1.5,
        iterations: 1,
      }

      let oldElem = this.$refs[`main-img-${oldImageIndex}`]
      oldElem.lastItem.$el.animate(oldTransition, oldTiming)
      // oldElem.lastItem.$el.animate(oldTransition, oldTiming)
      this.timeOut = setTimeout(()=>{
        let newElem = this.$refs[`main-img-${newImageIndex}`]
        newElem.lastItem.$el.animate(newTransition, newTiming)
      }, timing - 60)
      this.timeOutInner = setTimeout(()=> {
        this.activateImage(newImageIndex)
      }, timing - 30)
    },
    // Wait until 'interval' and go to the next image;
    startTimer(interval) {
      if (interval && interval > 0 && !this.stopSlider) {
        const self = this;
        clearTimeout(this.autoSlideTimeout);
        this.autoSlideTimeout = setTimeout(function() {
          self.nextImage();
          self.startTimer(self.autoSlideInterval);
        }, interval);
      }
    },
    // Stop the timer when hovering over the carousel
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
    // Start countdown from 'autoSlideInterval' to 0
    startCountdown() {
      if (!this.showProgressBar) return;
      const self = this;
      this.timerInterval = setInterval(function() {
        self.timeLeft -= self.countdownInterval;
        if (self.timeLeft <= 0) {
          self.timeLeft = self.autoSlideInterval;
        }
      }, this.countdownInterval);
    }
  }
};
</script>

<style lang="scss">

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
  margin-bottom: 15px;
}

.card-img > img {
  display: block;
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

.create-image {
    animation: createBox .99s;
}

.delete-image {
    animation: deleteBox .99s;
}

@keyframes createBox {
  from {
    transform: translateX(calc(-100%));
    // transform: scale(0.3);
  }
  to {
    transform: translateX(calc(0));
    // transform: scale(1);
  }
}

@keyframes deleteBox {
  from {
    transform: translateX(calc(0%));
    // transform: scale(0.3);
  }
  to {
    transform: translateX(calc(100%));
    // transform: scale(1);
  }
}
</style> 
