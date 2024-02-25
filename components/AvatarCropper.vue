<template>
  <div>
    <!-- <div class="header">
      <h2>Image Cropper</h2>
    </div>
    <hr /> -->
    <div class="content">
      <section class="cropper-area">
        <v-alert style="position:fixed;left: 50%;
        z-index:100;
        bottom: 50px;
        transform: translate(-50%, -50%);
        margin: 0 auto; " type="success" :value="!!success">{{ success }}</v-alert>
                <v-alert style="position:fixed;left: 50%;
        z-index:100;
        bottom: 50px;
        transform: translate(-50%, -50%);
        margin: 0 auto; " type="error" :value="!!error">{{ error }}</v-alert>
        <div style="min-height: 350px;" class="img-cropper">

          <vue-cropper
            ref="cropper"
            :src="imgSrc"
            :aspect-ratio="aspectRatio"
            :imgStyle="imgStyle"
            :autoCropArea="1"
            :viewMode="1"
            :background="false"
            dragMode="move"
          />

        </div>
        <div class="actions">
          <div class="d-flex justify-center align-center flex-wrap">
          <v-btn
            :disabled="isCropping"
            class="button"
            @click.prevent="rotate(90)"
          >
            Rotate +90deg
          </v-btn>
          <!-- <v-btn
            href="#"
            :disabled="isCropping"
            class="button"
            @click.prevent="rotate(-90)"
          >
            Rotate -90deg
          </v-btn> -->
          <v-btn
            ref="flipX"
            :disabled="isCropping"
            class="button"
            @click.prevent="flipX"
          >
            Flip X
          </v-btn>
          <v-btn
          :disabled="isCropping"
            ref="flipY"
            class="button"
            @click.prevent="flipY"
          >
            Flip Y
          </v-btn>
          <!-- <v-btn
            ref="flipX"
            :disabled="isCropping"
            class="button"
            @click.prevent="setFreeAspectRatio"
          >
            Free Mode
          </v-btn> -->
          <!-- <v-btn
            :disabled="isCropping"
            class="button"
            @click.prevent="setAspectRatio"
          >
            {{this.label}}
          </v-btn> -->
          <v-btn
            :disabled="isCropping"
            class="button"
            @click.prevent="reset"
          >
            Reset
          </v-btn>
          <v-btn
            :disabled="isCropping"
            style="background-color:red !important; color: white"
            class="button"
            @click.prevent="cropImage"
          >
          {{ !isCropping?  'Crop & Upload': 'Cropping...' }}
          </v-btn>
          </div>



        </div>

        <!-- <textarea v-model="data" /> -->
      </section>
    </div>
  </div>
</template>

<script>
import cropperjs from 'cropperjs';
export default {
  // components: {
  //   VueCropper,
  // },
  props: ['imgSrcIn', 'index', 'fileType','fileName','fileWidth','fileHeight'],
  data() {
    return {
      label: 'Portrait',
      isCropping: false,
      scaleX: 1,
      scaleY: 1,
      aspectRatio: 1/1,
      imgSrc: null,
      cropImg: '',
      data: null,
      imgStyle: {'height' : '350px'},
      error: null,
      success: null
    };
  },
  mounted() {
    this.imgSrc = this.imgSrcIn;
    this.$refs.cropper.replace(this.imgSrc);
    // this.$refs.cropper.imgStyle = {
    //   'height': '200px'
      
    // }


    // this.setImage(this.dataURLtoFile(this.imgSrcIn, this.fileName, this.fileType))


    // const reader = new FileReader();

    // reader.readAsDataURL(this.imgSrc);

    // this.fileWidth > this.fileHeight ? this.imgStyle = {'width': '600px'} : {'height':'350px'}

    // this.$refs.cropper.relativeZoom(coef)
    // if (this.fileWidth > this.fileHeight) {
    //   this.$refs.cropper.setAspectRatio(4/3);
    //   this.$refs.cropper.setCanvasData({
    //     width: 600
    //   });
      
    // } else {
    //   this.$refs.cropper.setAspectRatio(4/3);
    //   this.$refs.cropper.setCanvasData({
    //     height: 350
    //   });
    // }
    
    // createCropper((coef*img.width),(coef*img.height));

  },
  watch: {
    isCropping(val) {
      this.$emit('isCropping', val)
    },
    cropImg(val) {
      this.imgSrc = null
      this.$emit('cropImg', {img: val, index: this.index, fileType: this.fileType, fileName: this.fileName})
      this.isCropping = false
      
    },
    imgSrcIn: {
      handler(val) {
        this.imgSrc = val;
        this.$refs.cropper.replace(this.imgSrc);
        // let coef = 0;
        // this.fileWidth > this.fileHeight ? coef = this.calculateCoeff(this.fileWidth,"width") : coef = this.calculateCoeff(this.fileHeight,"height");
        // this.$refs.cropper.relativeZoom(coef)
        
      },
      deep: true,
      
    }
  },
  
  methods: {
    calculateCoeff(img_value, property){
      let x = 0;
      property=="width" ? x=600 : x=350;
      return ((x*100)/img_value)*0.01;
    },

    // dataURLtoFile(dataurl, fileName, fileType) {
    //   var arr = dataurl.split(','),
    //       mime = arr[0].match(/:(.*?);/)[1],
    //       bstr = atob(arr[1]), 
    //       n = bstr.length, 
    //       u8arr = new Uint8Array(n);
          
    //   while(n--){
    //       u8arr[n] = bstr.charCodeAt(n);
    //   }
      
    //   return new File([u8arr], fileName, {type: fileType});
    // },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.isCropping = true
      setTimeout(() => {
        try {
          this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL(this.fileType);
        } catch(e) {
          this.isCropping = false
          this.error = "Some error occured" + e
          setTimeout(() => {
            this.error = null
          }, 2000)
        }
      },1000)
      
      
      
     
    },
    flipX() {
      // const dom = this.$refs.flipX;
      // let scale = dom.getAttribute('data-scale');
      // scale = scale ? -scale : -1;
      this.scaleX = -this.scaleX;
      this.$refs.cropper.scaleX(this.scaleX);
      // dom.setAttribute('data-scale', scale);
    },
    flipY() {
      // const dom = this.$refs.flipY;
      // let scale = dom.getAttribute('data-scale');
      // scale = scale ? -scale : -1;
      this.scaleY = -this.scaleY;
      this.$refs.cropper.scaleY(this.scaleY);
      // dom.setAttribute('data-scale', scale);
    },
    getCropBoxData() {
      if (process.browser) {
        this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
      }
    },
    getData() {
      if (process.browser) {
         this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
      }
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;
      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(file) {
      // const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
            

      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    setAspectRatio() {
      if (this.aspectRatio > 1) {
        this.$refs.cropper.setAspectRatio(3/4)
        this.aspectRatio = 3/4
        this.label = 'Landscape'
        this.$forceUpdate()
      } else {  
        this.$refs.cropper.setAspectRatio(4/3)
        this.aspectRatio = 4/3
        this.label = 'Portrait'
        this.$forceUpdate()
      }
      
    },
    setFreeAspectRatio() {
      this.$refs.cropper.setAspectRatio(NaN)
      this.label = 'Fixed Mode'
      this.aspectRatio = NaN;
      this.$forceUpdate()
      
    }
  },
};
</script>
<style>
@import 'cropperjs/dist/cropper.css';
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* body {
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  margin: 0 auto;
} */
/* input[type="file"] {
  display: none;
} */
.cropper-container {
  
  max-width: 100% !important;
  max-height: 350px !important;
  height: 350px !important;
  overflow: hidden;
  /* right: 20px; */

}
.cropper-bg {
  
  max-height: 350px !important;
  overflow: hidden;

}
.img-container img {
  height: 100%;
}
/* .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}
.header h2 {
  margin: 0;
}
.header a {
  text-decoration: none;
  color: black;
}
.content {
  display: flex;
  justify-content: space-between;
} */
.cropper-area {
  width: 100%;
}
.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
.actions .button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  background-color: #0062CC !important;
  color: white !important;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.img-cropper {
  max-height: 350px;
  background-color: rgba(0,0,0,1);
}
.cropper-crop-box {
  z-index: 0
  /* margin-left: 20px; */
}
/* .preview-area {
  width: 307px;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
} */
.crop-placeholder {
  width: 100%;
  height: 200px;
 
}
.cropper-modal {
  opacity: 0;
}
.cropper-canvas {
  z-index: 0
  /* margin-left: 20px; */
}
/* .cropper-canvas img {
  height: 300px!important;
  width: auto !important;
} */
.cropped-image img {
  max-height: 100%;
}
</style>