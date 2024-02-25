<template>
  <v-card v-if="users.length">
     <input style="display:none;" id="myInput" v-model="emailList" />
    <div class="d-flex d-sm-block flex-wrap justify-space-between justify-sm-end">
    <vue-json-to-csv :json-data="users" :csv-title="title" :labels="labels">
      <v-btn style="float:right; margin: 5px;" @click="e=>{download()}">
        Download CSV
      </v-btn>
    </vue-json-to-csv>
    <v-btn style="float:right; margin:5px;" @click="copyEmail">Copy Emails</v-btn>

    </div>
    <v-card-title class="text-h6" style="word-break:break-word">
      {{ type + " (" + users.length + ")" }}
    </v-card-title>
   
    <v-row
      class="pa-4 userlist-container-row"
      justify="space-between"
    >
      <v-col class="col-12 col-sm-5">
        <v-list class="userlist">
            <v-list-item-group
              
              color="primary">
              <v-list-item

                v-for="(user, i) in users"
                @click="selected=user"
                :key="i">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="`${(user.firstName || user.lastName)? user.firstName + ' ' + user.lastName: user.email}`"></v-list-item-title>
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
            Select a user
          </div>
          <v-card
            v-else
            :key="selected.id"
            class="pt-0 mx-auto userlist-details"
            flat
            max-width="480"
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
              class="text-left mt-4"

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
            
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
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

  const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    data: () => ({
      title: (function() {
        const currentdate = new Date(); 
        const datetime = currentdate.getDate() + "_"
                + (currentdate.getMonth()+1)  + "_" 
                + currentdate.getFullYear() + "@"  
                + currentdate.getHours() + "_"  
                + currentdate.getMinutes() + "_" 
                + currentdate.getSeconds();
        return `All_user_data_at${datetime? '_'+datetime+'_': '_'}`
      })(),
      labels: {
        firstName: {title: 'First Name'},
        lastName: {title:'Last Name'},
        email: {title:'Email'},
        country: {title:'Country'},
        university: {title:'University'},
        major: {title:'Major'},
        expectedGraduationYear: {title:'Graduation Year'},
        degree: {title:'Degree'},
        interests: {title:'Interests'}
      },
      csvData: [],
      avatar: null,
      selected: null,
    }),
    props: {
      users: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    },
    watch: {
      selected: {
        handler(val) {
          this.randomAvatar()
        },
        deep: true
      },
    },

    computed: {
      emailList() {
        if (!this.users) return ''
        return this.users.map(e=>{return e.email}).join(', ')
      },

    },

    methods: {
      download() {


        // const currentdate = new Date(); 
        // const datetime = currentdate.getDate() + "_"
        //         + (currentdate.getMonth()+1)  + "_" 
        //         + currentdate.getFullYear() + "@"  
        //         + currentdate.getHours() + "_"  
        //         + currentdate.getMinutes() + "_" 
        //         + currentdate.getSeconds();
        // this.title=`User_data_at${datetime? '_'+datetime+'_': '_'}for_glober_event` + (this.event.title? ' - '+this.event.title : '' )
        // this.csvData = this.users
       
        // this.jsonData.forEach((data) => {
        //   this.csvData.push({
        //     id: data.id,
        //     url: data.url,
        //     purchaseDate: data.purchaseDate,
        //   });
        // });
      },
      copyEmail() {
        if (process.browser) {
          // /* Get the text field */
          let copyText = document.getElementById("myInput");

          // /* Select the text field */
          copyText.select();
          copyText.setSelectionRange(0, 99999); /* For mobile devices */

          navigator.clipboard
            .writeText(copyText.value)
            .then(() => {
              this.success = "Successfully copied emails!!"
              setTimeout(()=>{
                this.success = null
              },2000)
            })
            .catch(() => {
              this.error = "Something went wrong!!"
              setTimeout(()=>{
                this.error = null
              },2000)
            });
        }
      },
      randomAvatar () {
        this.avatar = avatars[Math.floor(Math.random() * avatars.length)]
      },
    },
  }
</script>
<style lang="scss">
.formulate-input {
  & [data-type="submit"] {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.userlist-container-row {
  @media screen and (max-width: 599px) {
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