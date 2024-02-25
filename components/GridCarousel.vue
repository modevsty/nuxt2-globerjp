<template>
  <div>
    <div class="d-flex justify-center align-center">
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
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      required: true
    },
    filteredImages: {
      required: true
    },
    thumbnailWidth: {
      default: null
    },
    eager: {
      default: true
    },
    postId: {
      default: false
    }
  },
  data() {
    return {
      imgFailed:false,
      lazyGifSmall: 'data:image/gif;base64,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',
      dragging: false,
    }
     
  },
  watch: {
    value: {
      handler(val) {
        this.activeImage = val
        this.$forceUpdate()
      },
      immediate: true
    },
    // activeImage(val) {
    //   console.log('emited', val)
    //   this.$emit('input',val)
    // }
  },
  methods: {
    imgErrorHandler(index) {
      if (index !== 0) {
        this.filteredImages[index].imageUrl = '';
        this.filteredImages[index].teaserImageUrl = '';
      } else {
        if (!this.imgFailed) {
          this.filteredImages.forEach((e, index) => {
            if (index !== 0) {
              e.imageUrl = '';
              e.teaserImageUrl = '';
            }
          })
          this.imgFailed=true
        }
      }
    },
    transitionImage(newImageIndex) {
      this.$emit('input', newImageIndex)
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
    
  }


}
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
  height: 100%;
  width: 100%;

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
