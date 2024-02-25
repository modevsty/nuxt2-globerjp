<template>
  <v-container v-if="eventImages" class="pa-0 mt-0">
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
    <v-card-title class="pa-0 py-2" style="word-break:break-word">
      Add Some Comment
    </v-card-title>
    <div style="display:flex; justify-content: center; align-items:start;">
      <div style="flex:1" class="add-event-photo-comment">
        <v-textarea auto-grow no-resize rows="1" outlined v-model="eventImages.comment" :rules="[v => !v || v.length <= 100 || 'Comment must be less than 100 characters long.']">
        </v-textarea>
      </div>
      <div class="pl-5">
        <v-btn height="55" @click="updateImageFirestore">
          <v-icon>
          mdi-floppy
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-card-title class="pa-0 pt-2" style="word-break:break-word">
      Upload Photos
    </v-card-title>
    <v-btn class="mt-5" block @click="addImage">
      <v-icon>mdi-plus-circle</v-icon>
      Add More Photo
    </v-btn>
    <v-btn class="mt-5" block @click="addMultipleImage">
      <v-icon>mdi-plus-circle</v-icon>
      Add Multiple Photo
    </v-btn>
    <input
      :ref="`multiImageFile`"
      multiple="multiple"
      type="file"
      style="display:none;"
      :accept="acceptType"
      @change.prevent="
        multiImageMiddleware($event.target.files).then(() => {
          removeMultiInputImageFile()
        })
      "
    />
    <v-card-text v-if="eventImagesReversedLength" class="pa-0 pt-10">
        <v-row>
          <v-col class="d-flex justify-center align-center" v-for="(index, i) in eventImagesReversedLength" :key="index">
            <v-card style="width: fit-content; max-width: 100%; margin-bottom: 40px; position: relative">
              <v-btn icon
                :disabled="isDeletingImage"
               @click="startDeleteImage(index)">
              <v-icon
               

               
                >mdi-close</v-icon
              >
              </v-btn>
              
              <v-dialog 
              :retain-focus="false"
              v-model="confirmDialog"
              max-width="290"
              >
                <v-card >
                  <v-card-title class="text-h6">
                    Are you sure?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="e => {removeImage(); confirmDialog = false}"
                    >
                      Yes
                    </v-btn>
                      <v-btn
                      color="blue darken-1"
                      text
                      @click="e=>{confirmDialog = false}"
                    >
                      No
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-card-text>
                <span>
                  <div class="mb-4" style="width: 260px; max-width: 100%;">
                    <label>Imageー{{ i + 1}}</label>
                    <br />

                    <div
                      style="width: 100%;"
                      v-if="
                        eventImages.images[index] &&
                          eventImages.images[index].teaserImageUrl
                      "
                    >
                      <img
                        :src="imgFailed? '/img/image-not-found.png':eventImages.images[index].teaserImageUrl"
                        @error="imgFailed=true"
                        style="max-width: 100%; width:260px; height: auto; object: cover; object-fit: cover; display: inline:block;"
                        alt=""
                      />
                    </div>
                    <div v-else>
                      <div v-if="isLoading[index]" style="min-height: 200px;width: 260px;" class="d-flex justify-center align-center" >
                        <Spinner v-if="isLoading[index]" />
                      </div>
                    </div>
                      

                    <v-btn
                      class="button-style"
                      elevation="0"
                      :disabled="isLoading[index]"
                      @click.prevent="e=>{launchImageFile(index);}"
                    >
                      {{ isLoading[index] ? 'Uploading...' : 'Choose File' }}
                    </v-btn>
                    <input
                      :ref="`imageFile${index}`"
                      type="file"
                      style="display:none;"
                      :accept="acceptType"
                      @click="e=>{removeInputImageFile(index);}"
                      @change.prevent="
                        imageMiddleware($event.target.files, index)
                      "
                    />
                    <v-dialog :persistent="isCropping" v-if="cropDialog.length > index" v-model="cropDialog[index]" offset-y max-width="600px" max-height="350px">
                      <!-- <template v-slot:activator="{ on }">
                        <v-row>
                          <v-col class="pb-0">
                            <v-btn
                              fab
                              bottom
                              ref="cropDialogOpen"
          
                              absolute
                              style="margin:auto;left:0;right:0"
                              color="primary" dark v-on="on"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </template> -->
                      <v-card class="d-flex flex-column justify-center align-center">
                        <v-row class="ma-0" style="width: 100%;">
                          <v-col class="d-flex justify-center pa-0">
                            <client-only>
                              <ImageCropper  @isCropping="isCroppingHandler" :imgSrcIn="imgSrc" :index="index" :fileType="fileImageCropper.type" :fileName="fileImageCropper.name" :fileWidth="fileImageCropper.width" :fileHeight="fileImageCropper.height" @cropImg="cropImgEventHandler" />
                            </client-only>
                          </v-col>
                        </v-row>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            text
                            @click="
                              e => {
                                cropDialog[index] = false;
                                $forceUpdate()
                              }
                            "
                          >
                            cancel</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
    </v-card-text>
  </v-container>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import Spinner from '@/components/LoadingSpinner'
export default {
  components: { ImageCropper, Spinner },
  data() {
    return {
      isDeletingImage: false,
      success: null,
      error: null,
      selectedIndex: null,
      imgFailed:false,
      confirmDialog: false,
      isCropping: false,
      isLoading: [],
      imgSrc: null,
      fileImageCropper: {name: '', type:'', width: 0, height: 0},
      cropDialog: [],
      eventImages: null,
      FULL_IMAGE: {
        maxDimension: 1280,
        quality: 0.9
      },
      THUMB_IMAGE: {
        maxDimension: 640,
        quality: 0.7
      },
      fileType: "file",
      acceptType: "image/*",
    }
  },
  computed: {
    isMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 800) ? false : true 
      }
      return true
    },
    isReallyMobileScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth >= 600) ? false : true 
      }
      return true
    },
    eventImagesReversedLength() {
      const reversed = [...Array(this.eventImages.images.length).keys()]
      reversed.reverse()
      return reversed
    },
    // isDeletingImage() {
    //   if (!this.eventImages.images) return [];
    //   const isDeletingImage = this.eventImages.images.map((_) => false);
    //   return isDeletingImage;
    // },
    // isUploadingImage() {
    //   if (!this.eventImages.images) return [];
    //   const isUploadingImage = this.eventImages.images.map((_) => false);
    //   return isUploadingImage;
    // },
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler(val) {
        this.eventImages = val
      },
      deep: true,
      immediate: true
    },
    eventImages: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    startDeleteImage(index) {
      if (this.isDeletingImage) {
        this.error = 'Wait a moment and click again...'
        setTimeout(() =>{
          this.error = null
        },2000)
        return
      }
      this.selectedIndex = index
      this.confirmDialog=true
    },
    isCroppingHandler(val) {
      this.isCropping = val
    },
    dataURLtoFile(dataurl, fileName, fileType) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], fileName, {type: fileType});
    },
    cropImgEventHandler(val) {
      this.cropDialog[val.index] = false
      this.$forceUpdate()
      this.imageSrc=''
      this.removeInputImageFile(val.index)
      const file = this.dataURLtoFile(val.img, val.fileName, val.fileType)
      this.uploadImageFile([file],val.index)
    },
    async getEventImages(event) {
      // console.log("selected thing",event)
      if (!event || !event.id) {
        this.eventImages = null;
        return
      }
      let eventId = event.id
      let eventImages = await this.$fire.firestore.collection('eventImages')
      .where("userId","==",this.user.uid)
      .where("eventId","==",eventId)
      .get()
      .then((querySnapshot) => {
        let out = []
        querySnapshot.forEach((doc) => {
          let id = doc.id
          let data = doc.data()
          out.push({
            id,
            ...data
          })
        })
        return out
      })
      if (!eventImages[0]) {
        eventImages = {
          userId: this.user.uid,
          eventId,
          comment: "",
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          images: []
        }
        await this.$fire.firestore.collection('eventImages').add(eventImages)
        .then((docRef) => {
          eventImages = [{
            ...eventImages,
            id: docRef.id
          }]
        })
        .catch(err => {
          console.log(err)
        })
      }
      this.eventImages = {
        userId: this.user.uid,
        eventId,
        comment: "",
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        images: [],
        ...eventImages[0]
      }
    },
    async updateImageFirestore() {
      try{
          const date = Date.now().toString()
          let data = {
            userId: this.eventImages.userId,
            eventId: this.eventImages.eventId,
            images: this.eventImages.images,
            comment: this.eventImages.comment,
            createdAt: this.eventImages.images.length? this.eventImages.createdAt : date,
            updatedAt: date
          }
          await this.$fire.firestore.collection("eventImages").doc(this.eventImages.id).update(data)
          .then(()=>{
            this.success = "Successfully updated!!"
            this.$emit('imageUpdating', false)
            this.$emit('imageUpdated', true)
            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          this.error = "Could not set user information"
          setTimeout(()=>{
            this.error = null
          },2000)
        }
    },
    async deleteImage(index) {

      const fullImageDeletePromise = this.$fire.storage
        .refFromURL(this.eventImages.images[index].imageUrl)
        .delete();
      const thumbImageDeletePromise = this.$fire.storage
        .refFromURL(this.eventImages.images[index].teaserImageUrl)
        .delete();

      return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
        .then(async () => {
          this.eventImages.images[index].imageUrl = '';
          this.eventImages.images[index].teaserImageUrl = '';
          if (this.eventImages.images[index].width) {
            delete this.eventImages.images[index].width
          }
          if (this.eventImages.images[index].height) {
            delete this.eventImages.images[index].height
          }

          

          for (let i = index; i > 0; i--) {
            const temp = this.eventImages.images[i]
            this.eventImages.images[i] = this.eventImages.images[i - 1]
            this.eventImages.images[i - 1] = temp
          }
          this.eventImages.images.shift()

          this.cropDialog.splice(index, 1);
          this.isLoading.splice(index, 1)
                    this.$forceUpdate()
                    // this.eventImages.images.splice(index, 1);
          
          
          await this.updateImageFirestore();
          return null;
        })
        .catch(async (error) => {
          // eslint-disable-next-line no-console
          console.error('Error deleting image', error);

          if (error.code === 'storage/object-not-found') {
            this.eventImages.images[index].imageUrl = '';
            this.eventImages.images[index].teaserImageUrl = '';
            if (this.eventImages.images[index].width) {
              delete this.eventImages.images[index].width
            }
            if (this.eventImages.images[index].height) {
              delete this.eventImages.images[index].height
            }
            // this.eventImages.images.splice(index, 1);

          for (let i = index; i > 0; i--) {
            const temp = this.eventImages.images[i]
            this.eventImages.images[i] = this.eventImages.images[i - 1]
            this.eventImages.images[i - 1] = temp
          }
          this.eventImages.images.shift()
            this.cropDialog.splice(index, 1);
            this.isLoading.splice(index, 1)
                        this.$forceUpdate()
            await this.updateImageFirestore();

          }
        })
        // .finally(() => {
        //   this.isDeletingImage[index] = false;
        // });
    },
    launchImageFile(index) {
      const file = `imageFile${index}`;
      this.$refs[file][0].click();
    },
    removeInputImageFile(index) {
      const file = `imageFile${index}`;
      this.$refs[file][0].value = null
      // this.$refs[file][0].click();
    },
    async multiImageMiddleware(files) {
      if (process.browser) {
        let sizeLimit = this.isAdmin? 50: 20
        if (!files.length) {
          return;
        }

        if (files.length > (sizeLimit - this.eventImages.images.length)) {
          this.error=`Cannot add more than ${sizeLimit} Photos. Please remove some photos first.`
          setTimeout(()=>{
            this.error = null
          },5000)
          return
        }

        let isOk = true
        let errMessage = ''

        files.forEach(file => {
          if (!file.type.match('image.*')) {
            // eslint-disable-next-line no-alert
            errMessage += "Some Files aren't Image Format. "
            isOk = false
          }

          if (file.size > 20000000) {
            // eslint-disable-next-line no-alert
            errMessage += "Image size should be less than 20 MB!"
            isOk = false
          }
        })

        if(!isOk) {
          this.error=errMessage
          setTimeout(()=>{
            this.error = null
          },5000)
          return
        }

        this.$emit('imageUpdating', true)

        const uploadPromises = []
        let firstIndex = this.eventImages.images.length
        
        const fileNames = []
        const metaDatas = []
        files.forEach(file => {
          let index = this.eventImages.images.length
          this.eventImages.images.push({ imageUrl: '', teaserImageUrl: '' });
          this.isLoading.push(false);
          uploadPromises.push(...this.uploadPromise([file], index))
          fileNames.push(file.name)
          metaDatas.push({
            contentType: file.type
          })
        })
        let pairs = []
        let pair = []
        await Promise.all(uploadPromises)
        .then((results) => {
          results.forEach((result, i) => {
            if(i %2==0) {
              pair.push(result)
            } else {
              pair.push(result)
              pairs.push(pair)
              pair = []
            }
          })
        })
        const promises = []

        pairs.forEach((pair, i) => {
          promises.push(...this.multiImagePromise(pair, fileNames[i], metaDatas[i]))
        })

        pairs = []
        pair = []

        // this.$forceUpdate();


        await Promise.all(promises)
        .then((results) => {
          results.forEach((result, i) => {
            if(i %2==0) {
              pair.push(result)
            } else {
              pair.push(result)
              pairs.push(pair)
              pair = []
            }
          })
        })

        const imagePromises = []

        pairs.forEach((results,i) => {
          let index = i + firstIndex
          this.eventImages.images[index].imageUrl = results[0];
          this.eventImages.images[index].teaserImageUrl = results[1];
          const imagePromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              this.eventImages.images[index]['width'] = img.width;
              this.eventImages.images[index]['height'] = img.height;
              this.isLoading[index] = false;
              resolve(img)};
            img.onerror = (e) => reject(e);
            img.src = results[1];
          })
          imagePromises.push(imagePromise)
          // image.addEventListener('load', async () => {
          //   console.log('doing', index)
          //   this.eventImages.images[index]['width'] = image.width;
          //   this.eventImages.images[index]['height'] = image.height;
          //   image = null
          //   await this.updateImageFirestore();
          // })
          // image.src = results[1];
          // this.isLoading[index] = false;
        })

        await Promise.all(imagePromises)
        await this.updateImageFirestore()
        // pairs = null
        // pair = null

        this.$forceUpdate()

        // await this.uploadImageFile(files,index)

        this.removeMultiInputImageFile()

      }

    },
    async imageMiddleware(files, index) {
      if (process.browser) {
        if (!files.length) {
          return;
        }
        const file = files[0];
        if (!file.type.match('image.*')) {
          // eslint-disable-next-line no-alert
          alert('Please upload an image.');
          return;
        }

        if (file.size > 20000000) {
          // eslint-disable-next-line no-alert
          alert('Image size should be less than 20 MB!');
          return;
        }
        
        let reader  = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          this.imgSrc = reader.result

          this.fileImageCropper.name = file.name
          this.fileImageCropper.type = file.type
          this.cropDialog[index] = true
          this.$forceUpdate();
          reader = null
        }, false) 
      }

    },
    multiImagePromise(images, fileName, metadata) {
      
      const date = Date.now().toString()

      const fullImageUploadPromise = this.uploadSingleImageFile(
        date + "_" + fileName,
        images[0],
        metadata
      );

      const thumbFileName =
        date + "_" +
        fileName.substring(0, fileName.lastIndexOf('.')) +
        '_thumb.' +
        fileName.substring(fileName.lastIndexOf('.') + 1);

      const thumbImageUploadPromise = this.uploadSingleImageFile(
        thumbFileName,
        images[1],
        metadata
      );
      // if (this.eventImages.images[index].imageUrl !== "") {
      //   await this.deleteImage(index).catch((err) => {
      //     console.log(err)
      //     return
      //   })
      // }
      return [fullImageUploadPromise, thumbImageUploadPromise]

    },
    uploadPromise(files, index) {
      if (!files.length) {
        return;
      }
      this.isLoading[index] = true;
      const file = files[0];
      this.$forceUpdate()

      if (!file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image.');
        return;
      }

      // const metadata = {
      //   contentType: file.type
      // };

      const fullImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.FULL_IMAGE.maxDimension,
          this.FULL_IMAGE.quality,
          resolve
        );
      });

      const thumbImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.THUMB_IMAGE.maxDimension,
          this.THUMB_IMAGE.quality,
          resolve
        );
      });
      return [
        fullImageResizePromise,
        thumbImageResizePromise
      ]

      

      // await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
      //   .then(async (results) => {
      //     this.eventImages.images[index].imageUrl = results[0];
      //     this.eventImages.images[index].teaserImageUrl = results[1];
      //     let image = new Image();
      //     image.addEventListener('load', async () => {
      //       this.eventImages.images[index]['width'] = image.width;
      //       this.eventImages.images[index]['height'] = image.height;
      //       image = null
      //       await this.updateImageFirestore();
      //     })
      //     image.src = results[1];
      //     this.isUploadingImage[index] = false;
      //     this.isLoading[index] = false;
      //     this.$forceUpdate()
          
      //   })
      //   .finally(() => {
      //     this.isUploadingImage[index] = false;
      //   });
    },
    async uploadImageFile(files, index) {
      if (!files.length) {
        return;
      }
      this.isLoading[index] = true;
      const file = files[0];
      this.$forceUpdate()

      if (!file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image.');
        return;
      }

      const metadata = {
        contentType: file.type
      };

      const fullImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.FULL_IMAGE.maxDimension,
          this.FULL_IMAGE.quality,
          resolve
        );
      });

      const thumbImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          file,
          this.THUMB_IMAGE.maxDimension,
          this.THUMB_IMAGE.quality,
          resolve
        );
      });

      const images = await Promise.all([
        fullImageResizePromise,
        thumbImageResizePromise
      ]);
      
      const date = Date.now().toString()

      const fullImageUploadPromise = this.uploadSingleImageFile(
        date + "_" + file.name,
        images[0],
        metadata
      );

      const thumbFileName =
        date + "_" +
        file.name.substring(0, file.name.lastIndexOf('.')) +
        '_thumb.' +
        file.name.substring(file.name.lastIndexOf('.') + 1);
      const thumbImageUploadPromise = this.uploadSingleImageFile(
        thumbFileName,
        images[1],
        metadata
      );
      if (this.eventImages.images[index].imageUrl !== "") {
        await this.deleteImage(index).catch((err) => {
          console.log(err)
          return
        })
      }
      this.$emit('imageUpdating', true)


      await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
        .then(async (results) => {
          this.eventImages.images[index].imageUrl = results[0];
          this.eventImages.images[index].teaserImageUrl = results[1];
          let image = new Image();
          image.addEventListener('load', async () => {
            this.eventImages.images[index]['width'] = image.width;
            this.eventImages.images[index]['height'] = image.height;
            image = null
            await this.updateImageFirestore();
          })
          image.src = results[1];
          this.isLoading[index] = false;
          this.$forceUpdate()
          
        })

    },
    uploadSingleImageFile(filename, blob, metadata) {
      const storage = this.$fire.storage;
      const imageRef = storage.ref(`eventImages/${this.eventImages.id}/${filename}`);

      return imageRef
        .put(blob, metadata)
        .then(snapshot => {
          // eslint-disable-next-line promise/no-nesting
          return snapshot.ref.getDownloadURL().then(url => {
            return url;
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error uploading image', error);
        });
    },
    generateVariation(file, maxDimension, quality, cb) {
      const displayPicture = (url) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          const canvas = this.getScaledCanvas(image, maxDimension);
          canvas.toBlob(cb, 'image/jpeg', quality);
        };
      };

      const reader = new FileReader();
      reader.onload = e => displayPicture(e.target.result);
      reader.readAsDataURL(file);
    },
    getScaledCanvas(image, maxDimension) {
      const scaledCanvas = document.createElement('canvas');

      if (image.width > maxDimension || image.height > maxDimension) {
        if (image.width > image.height) {
          scaledCanvas.width = maxDimension;
          scaledCanvas.height = (maxDimension * image.height) / image.width;
        } else {
          scaledCanvas.width = (maxDimension * image.width) / image.height;
          scaledCanvas.height = maxDimension;
        }
      } else {
        scaledCanvas.width = image.width;
        scaledCanvas.height = image.height;
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
        );
      return scaledCanvas;
    },
    addImage() {
      let sizeLimit = this.isAdmin? 50: 20
      if (this.eventImages.images.length >= sizeLimit) {
        this.error=`Cannot add more than ${sizeLimit} Photos. Please remove some photos first.`
        setTimeout(()=>{
          this.error = null
        },5000)
        return
      }
      this.eventImages.images.push({ imageUrl: '', teaserImageUrl: '' });
      this.cropDialog.push(false);
      this.isLoading.push(false);
      this.$forceUpdate();
      // await this.updateImageFirestore();
    },
    addMultipleImage() {
      const file = `multiImageFile`;
      this.$refs[file].click();
    },
    removeMultiInputImageFile() {
      const file = `multiImageFile`;
      this.$refs[file].value = null
      // this.$refs[file][0].click();
    },
    async removeImage() {
      this.$emit('imageUpdating', true)
      // const confirmation = window.confirm('Are you sure?');
      // if (!confirmation) return;
      
      // console.log(confirmation);
      // console.log(reversedIndex, input)
      // const len = this.eventImages.images.length - 1
      this.isDeletingImage= true;
      const index = this.selectedIndex

      
      if (this.eventImages.images[index].imageUrl !== '') {
        await this.deleteImage(index);
        // const images = [...this.eventImages.images].slice(index, 1)
        // this.eventImages.images = images;
        // this.cropDialog.splice(index, 1);
        // this.isLoading.splice(index, 1)
       
      } else {
        this.eventImages.images.splice(index, 1);
      }
      this.$emit('imageUpdating', false)
      setTimeout(()=> {
        this.isDeletingImage = false
      }, 2000)

      // this.qualifications.forEach((qualification, index) => {
      //   qualification.id = index;
      // });
    },

  }
}
</script>