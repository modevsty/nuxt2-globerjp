<template>
  <FormulateForm
    class="d-flex justify-center flex-column"
    style="width: 100%;"
    v-model="values"
    :schema="schema"
  />
</template>

<script>
  /**
   * Example of a custom Image selector
   * Key is to emit a select-file event when a file needs to be added
   */
  // import { VImg } from 'vuetify/lib'
  export default {
    name: "FileSelector",
    // components: { VImg },
    data() {
      // Some public domain images from wikimedia.
      return {
        imgFailed: false,
        FULL_IMAGE: {
          maxDimension: 1280,
          quality: 0.9
        },
        THUMB_IMAGE: {
          maxDimension: 640,
          quality: 0.7
        },
        userRepo: {
          images: []
        },
        // images: [
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Streifenhoernchen.jpg/1024px-Streifenhoernchen.jpg', alt: 'Siberian Chipmunk' },
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/NASA_Mars_Rover.jpg/750px-NASA_Mars_Rover.jpg', alt: 'NASA Mars Rover' },
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Muybridge_race_horse_animated.gif', alt: 'Muybridge race horse animated' },
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Locomotive_TEM2M-063_2006_G2.jpg', alt: 'Locomotive TEM2M-063 2006 G2' },
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/8/80/ISS_March_2009.jpg', alt: 'ISS March 2009' },
        //   { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/F-18F_after_launch_from_USS_Abraham_Lincoln_%28CVN-72%29.jpg', alt: 'F-18F after launch from USS Abraham Lincoln (CVN-72)' },
        // ]
      };
    },
    async created() {
      await this.getUserRepo();
    },
    computed: {
      user() {
        return this.$nuxt.$store.state.authUser
      },
      eventImagesReversedLength() {
        return [...Array(this.userRepo.images.length).keys()].slice().reverse()
      },
      isDeletingImage() {
        if (!this.userRepo) return [];
        const isDeletingImage = this.userRepo.images.map((_) => false);
        return isDeletingImage;
      },
      isUploadingImage() {
        if (!this.userRepo) return [];
        const isUploadingImage = this.userRepo.images.map((_) => false);
        return isUploadingImage;
      },
    },
    methods: {
      selectImage(img) {
        let image = {
          src: img.imageUrl,
          alt: ""
        }
        this.$emit('select-file', image);
      },
      async getUserRepo() {
      let res = await this.$nuxt.$fire.firestore.collection('repoImages')
      .doc(this.user.uid)
      .get();
      if (res.exists) {
        let id = res.id
        let data = res.data()
        this.userRepo = {
          ...data,
          id
        }
      }
      },
      async deleteImage(index) {
        this.isDeletingImage[index] = true;

        const fullImageDeletePromise = this.$nuxt.$fire.storage
          .refFromURL(this.userRepo.images[index].imageUrl)
          .delete();
        const thumbImageDeletePromise = this.$nuxt.$fire.storage
          .refFromURL(this.userRepo.images[index].teaserImageUrl)
          .delete();

        return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
          .then(async () => {
            this.userRepo.images[index].imageUrl = '';
            this.userRepo.images[index].teaserImageUrl = '';
            await this.updateImageFirestore();
            return null;
          })
          .catch(async (error) => {
            // eslint-disable-next-line no-console
            console.error('Error deleting image', error);

            if (error.code === 'storage/object-not-found') {
              this.userRepo.images[index].imageUrl = '';
              this.userRepo.images[index].teaserImageUrl = '';
              await this.updateImageFirestore();
            }
          })
          .finally(() => {
            this.isDeletingImage[index] = false;
          });
      },
      launchImageFile(index) {
        const file = `imageFile${index}`;
        this.$refs[file][0].click();
      },
      launchImageFilePicker() {
        const file = `imageFilePicker`;
        this.$refs[file].click();
      },
      async uploadImageFile(files, index) {
        if (!files.length) {
          return;
        }
        const file = files[0];

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
          date + "_" +file.name,
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
        // no need anymore
        // if (this.userRepo.images[index].imageUrl !== "") {
        //   await this.deleteImage(index).catch((err) => {
        //     console.log(err)
        //     return
        //   })
        // }

        // this.isUploadingImage[index] = true;

        await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
          .then(async (results) => {
            let image = {
              imageUrl: results[0],
              teaserImageUrl: results[1]
            }
            this.userRepo.images.push(image);
            // this.userRepo.images[index].imageUrl = results[0];
            // this.userRepo.images[index].teaserImageUrl = results[1];
            await this.updateImageFirestore();
          })
          // .finally(() => {
          //   this.isUploadingImage[index] = false;
          // });
      },
      uploadSingleImageFile(filename, blob, metadata) {
        const imageRef = this.$nuxt.$fire.storage.ref(`repoImages/${this.user.uid}/${filename}`);

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
        this.userRepo.images.push({ imageUrl: '', teaserImageUrl: '' });
        // await this.updateImageFirestore();
      },
      async removeImage(index) {
        const confirmation = confirm('Are you sure?');
        // console.log(confirmation);

        if (!confirmation) return;
        if (this.userRepo.images[index].imageUrl !== '') {
          await this.deleteImage(index);
          this.userRepo.images.splice(index, 1);
          await this.updateImageFirestore();
        } else {
          this.userRepo.images.splice(index, 1);
        }

      },
      async updateImageFirestore() {
        try{
            let data = {
              images: this.userRepo.images
            }
            await this.$nuxt.$fire.firestore.collection("repoImages").doc(this.user.uid).set(data).then(()=>{
              this.success = "Successfully updated!!"
              setTimeout(()=>{
                this.success = null
              },2000)
            })
          } catch(error) {
            console.log(error)
            this.error = "Could not set user information."
            setTimeout(()=>{
              this.error = null
            },2000)
          }
      }
    }
  }
</script>

<style scoped>
  .selectable {
    cursor: pointer;
  }
</style>