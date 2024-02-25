<template>
<div>
    <v-card-title class="text-h6" style="">
      {{ "Attendees" + " (" + attendees.length + ")" }}
    </v-card-title>
   
    <v-row
      class="pa-4 userlist-container-row"
      justify="space-between"
    >
      <v-col class="col-12 col-md-5">
        <v-list class="userlist">
            <v-list-item-group
              
              color="primary">
              <v-list-item

                v-for="(attendee, i) in attendees"
                @click="selected=attendee"
                :key="i">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="`${attendee.firstName + ' ' + attendee.lastName}`"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
        </v-list>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col
        class="d-flex text-center"
      >
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="text-h6 grey--text text--lighten-1 font-weight-light"
            style="align-self: center; position: relative"
          >
            Select an attendee
          </div>
          <v-card
            v-else
            :key="selected.id"
            class="pt-0 mx-auto userlist-details"
            flat
            style="width: min(100%, 400px)"
          >
            <v-card-text>
              <nuxt-link :to="`/profile/${selected.id}`">
              <v-avatar
                v-if="avatar"
                size="88"
              >
                <v-img
                  :src="`https://avataaars.io/${avatar}`"
                  class="mb-6"
                ></v-img>
              </v-avatar>
              </nuxt-link>
              <h3 class="text-h5 mb-2">
                {{ selected.firstName + " " + selected.lastName }}
              </h3>
              
              <div class="blue--text mb-2">
                {{ selected.email }}
              </div>
              <div class="blue--text subheading font-weight-bold">
                {{ selected.country }}
              </div>
            </v-card-text>
            <v-divider></v-divider>
             <v-row
              class="text-left mt-4 mb-4"

            >
              <v-col
                class="text-right mr-4 mb-0 "
                tag="strong"
                cols="5"
              >
                University
              </v-col>
              <v-col cols="5">
                {{ selected.university? selected.university : 'N/A' }}
              </v-col>
              <v-col
                class="text-right mr-4 mb-0"
                tag="strong"
                cols="5"
              >
                Major
              </v-col>
              <v-col cols="5">{{ selected.major ?  selected.major : 'N/A'}}</v-col>
              <v-col
                class="text-right mr-4 mb-0"
                tag="strong"
                cols="5"
              >
                Graduation Year
              </v-col>
              <v-col cols="5">{{ selected.expectedGraduationYear?  selected.expectedGraduationYear : 'N/A'}}</v-col>
                          <v-col
                class="text-right mr-4 mb-0"
                tag="strong"
                cols="5"
              >
                Degree
              </v-col>
              <v-col cols="5">{{ selected.degree ? selected.degree : 'N/A'}}</v-col>
              <v-col
                class="text-right mr-4 mb-0"
                tag="strong"
                cols="5"
              >
                Date of Entry into Japan
              </v-col>
              <v-col cols="5">{{ selected.dateOfEntry? selected.dateOfEntry : 'N/A' }}</v-col>
             
              <v-col
                class="text-right mr-4 mb-0"
                tag="strong"
                cols="5"
              >
                Interests
              </v-col>
              <v-col cols="5">{{ selected.interests && selected.interests.length? selected.interests.join(', \n'): 'N/A' }}</v-col>
             
            </v-row>
            
            <div v-if="!(customFormValues
                    && Object.keys(customFormValues).length === 0
                    && Object.getPrototypeOf(customFormValues) === Object.prototype)">
             <v-divider></v-divider>
            
            <v-row class="text-left">
               
              <v-col v-if="selected" style="width: min(100%, 480px)" >
                <h3 class="mb-3 mt-5">Form Answers</h3>
                <div class="mb-3" v-for="(val, key, i) in customFormValues" :key="i">
                  
                    <div class="d-flex flex-column" v-if="customFormElementNameToObjDict[key].type == 'file'">
                      <div style="font-weight: 500">{{ customFormElementNameToObjDict[key].label }} </div>
                      <v-btn @click="downloadMe(customFormValues[key].url)"
                        icon
                        color="blue"
                        >
                        <v-icon>mdi-download</v-icon>
                      </v-btn>
                    </div>
                    <FormulateInput
                      v-else
                      v-model="customFormValues[key]"
                      disabled
                      :options="customFormElementNameToObjDict[key].options"
                      :type="customFormElementNameToObjDict[key].type"
                      :label="customFormElementNameToObjDict[key].label"
                      :name="customFormElementNameToObjDict[key].name"
                    />
                  
                  
                </div>
              </v-col>
            </v-row>
            </div>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  const avatars = [
    '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=PastelRed&clotheType=CollarSweater&eyeType=Squint&eyebrowType=DefaultNatural&facialHairColor=Brown&facialHairType=BeardLight&hairColor=Blue&hatColor=Blue01&mouthType=Disbelief&skinColor=Tanned&topType=Hat',
    '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Gray02&clotheType=BlazerSweater&eyeType=Default&eyebrowType=RaisedExcitedNatural&facialHairColor=BrownDark&facialHairType=MoustacheMagnum&hairColor=Blue&hatColor=Heather&mouthType=Disbelief&skinColor=Light&topType=ShortHairShortWaved',
    '?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=Red&clotheType=BlazerSweater&eyeType=Dizzy&eyebrowType=UnibrowNatural&facialHairColor=Red&facialHairType=MoustacheFancy&graphicType=Pizza&hairColor=Platinum&hatColor=PastelGreen&mouthType=Tongue&skinColor=Yellow&topType=ShortHairShaggyMullet',
    '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=PastelRed&clotheType=CollarSweater&eyeType=Side&eyebrowType=Default&facialHairColor=Brown&facialHairType=MoustacheMagnum&graphicType=Bat&hairColor=BrownDark&hatColor=Pink&mouthType=Twinkle&skinColor=Brown&topType=LongHairFro',
    '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=ShirtCrewNeck&eyeType=Close&eyebrowType=UpDownNatural&facialHairColor=Blonde&facialHairType=BeardLight&graphicType=Skull&hairColor=Platinum&hatColor=Pink&mouthType=Tongue&skinColor=DarkBrown&topType=Hijab',
    '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=PastelRed&clotheType=BlazerShirt&eyeType=Side&eyebrowType=Default&facialHairColor=BlondeGolden&facialHairType=BeardMedium&graphicType=Diamond&hairColor=PastelPink&hatColor=White&mouthType=Serious&skinColor=Black&topType=LongHairStraight',
    '?accessoriesType=Prescription01&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=ShirtCrewNeck&eyeType=Wink&eyebrowType=Angry&facialHairColor=Platinum&facialHairType=BeardMajestic&graphicType=Bat&hairColor=BlondeGolden&hatColor=PastelOrange&mouthType=Tongue&skinColor=Black&topType=NoHair',
    '?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=BlazerSweater&eyeType=Side&eyebrowType=RaisedExcitedNatural&facialHairColor=Auburn&facialHairType=BeardLight&graphicType=Skull&hairColor=Blonde&hatColor=Blue01&mouthType=Eating&skinColor=Yellow&topType=ShortHairDreads01',
    '?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
    '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
    '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
    '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
    '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
  ]
  // import CsvDownloadBtn from '@/components/CsvDownloadBtn'

  const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    // components: {
    //   CsvDownloadBtn
    // },
    data: () => ({
      avatar: null,
      selected: null,
      customFormValues: null,
      customFormElementNameToObjDict: null,
    }),
    props: {
      userIdtoEntryDict: {
        type: Object,
        required: true
      },
      attendees: {
        type: Array,
        required: true
      },
      schema: {
        type: Array,
        required: true
      },
    },
    watch: {
      selected: {
        handler(val) {
          this.randomAvatar()
          this.customFormValues = {...this.userIdtoEntryDict[val.id].customFormValues}
          this.customFormElementNameToObjDict = {...this.userIdtoEntryDict[val.id].customFormElementNameToObjDict}
        },
        deep: true
      },
    },

    computed: {
      emailList() {
        if (!this.attendees) return ''
        return this.attendees.map(e=>{return e.email}).join(', ')
      },
    },

    methods: {
      downloadMe(href) {
        // console.log(index)
        const link = document.createElement('a')
        link.href = href
        link.download = 'image_' + Date.now().toString()
        link.target = '_blank'
        link.click()
      },
      randomAvatar () {
        this.avatar = avatars[Math.floor(Math.random() * avatars.length)]
      },
    },
  }
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.formulate-form {
  .formulate-input {
    width: 100% !important;
    .formulate-input-wrapper {
      .formulate-input-label {
        display: inline;
        max-width: calc(100% - 15px) !important;
      }
      .formulate-input-element {
        max-width: 100%;
      }
    }
  }
}
.formulate-input {
  width: 100% !important;
    .formulate-input-wrapper {
      .formulate-input-label {
        display: inline;
        max-width: calc(100% - 15px) !important;
      }
      .formulate-input-element {
        max-width: 100%;
      }
    }
  & [data-type="submit"] {
    display: none;
  }
  & [data-type="radio"] {
    margin-bottom: 0em !important
  }
  & [data-type="checkbox"] {
    margin-bottom: 0em !important
  }
  margin-bottom: 30px !important

}
</style>
<style lang="scss" scoped>
.userlist-container-row {
  @media screen and (max-width: 959px) {
    display: flex;
    flex-direction: column;
    .userlist {
      height: 180px;
      overflow: scroll;
      border: thin solid rgba(0,0,0,0.12)
    }
  }
  .userlist-details {
    height: fit-content; 
    position: sticky; 
    top: 0;
    @media screen and (max-width: 599px) {
      position: relative;

    }
  }
}
</style>