<template>
  <v-container style="padding-top: 150px">
    <v-row>
      <v-col class="d-flex justify-center pb-0">
        <div style="position: absolute; top:0;width: 100%;height:400px">
          <div
            class="d-flex justify-center"
            style="width: 100%; position: relative; overflow: hidden;height:400px;"
          >
            <v-img
              v-if="profile.backgroundImage && profile.backgroundImage.imageUrl"
              :src="imgFailed? '/img/default_background.jpg' :profile.backgroundImage.imageUrl"
              @error="imgFailed=true"
              style="object-fit: cover"
              height="100%"
              width="100%"
            />
            <v-img
              v-else
              style="object-fit: cover"
              src="/img/default_background.jpg"
              height="100%"
              width="100%"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center pb-0" style="margin-top: 60px;">
        <div
          class="d-flex justify-center"
          style="width: fit-content; position: relative; z-index: 100; border: 5px solid white"
        >
          <v-img
            v-if="profile.avatarImage && profile.avatarImage.imageUrl"
            :src="imgFailed? '/img/image-not-found.png' :profile.avatarImage.imageUrl"
            @error="imgFailed=true"
            lazy-src="/img/default_profile.png"
            style="object-fit: cover"
            height="200"
            width="200"
          />
          <v-img
            v-else
            style="object-fit: cover"
            src="/img/default_profile.png"
            height="200"
            width="200"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="profile.firstName && profile.firstName.replace(/\s/g, '').length">
      <v-col cols="12" class="d-flex justify-center text-center pa-0">
        <v-card-title>
          {{ !profileShow || profileShow.realName ? profile.firstName+" "+profile.lastName : (profile.nickName? profile.nickName : profile.firstName)}}
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card-title class="font-weight-bold">
          Basic Information
        </v-card-title>
        <v-card class="pa-3">
          <v-row>
            <!-- <v-col v-if="!profileShow || profileShow.nickName" cols="12" md="6">
              <v-card-title> NICK NAME </v-card-title>
              <v-card-text v-if="profile.nickName  && (profile.nickName.replace(/\s/g, '').length)">
                <div style="color:#000;font-size:18px;">{{ profile.nickName }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.realName" cols="12" md="6">
              <v-card-title> NAME </v-card-title>
              <v-card-text v-if="(profile.firstName || profile.lastName) && (profile.firstName.replace(/\s/g, '').length || profile.lastName.replace(/\s/g, '').length)">
                <div style="color:#000;font-size:18px;">{{ profile.firstName + " " + profile.lastName }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col> -->
            <v-col v-if="!profileShow || profileShow.country" cols="12" md="6">
              <v-card-title> COUNTRY</v-card-title>
              <v-card-text v-if="profile.country">
                <div style="color:#000;font-size:18px;">{{ profile.country }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.university" cols="12" md="6">
              <v-card-title> UNIVERSITY </v-card-title>
              <v-card-text v-if="profile.university && profile.university.replace(/\s/g, '').length">
                <div style="color:#000;font-size:18px;">
                  {{ profile.university }}
                </div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.expectedGraduationYear" cols="12" md="6">
              <v-card-title style="word-break: break-word"> EXPECTED GRADUATION YEAR </v-card-title>
              <v-card-text v-if="profile.expectedGraduationYear">
                <div style="color:#000;font-size:18px;">{{ profile.expectedGraduationYear }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.degree" cols="12" md="6">
              <v-card-title> DEGREE </v-card-title>
              <v-card-text v-if="profile.degree">
                <div style="color:#000;font-size:18px;">
                  {{ profile.degree }}
                </div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.major" cols="12" md="6">
              <v-card-title> MAJOR </v-card-title>
              <v-card-text v-if="profile.major && profile.major.replace(/\s/g, '').length">
                <div style="color:#000;font-size:18px;">{{ profile.major }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.dateOfEntry" cols="12" md="6">
              <v-card-title style="word-break: break-word"> DATE OF ENTRY INTO JAPAN </v-card-title>
              <v-card-text v-if="profile.dateOfEntry && profile.dateOfEntry.replace(/\s/g, '').length">
                <div style="color:#000;font-size:18px;">{{ profile.dateOfEntry }}</div>
              </v-card-text>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
            <v-col v-if="!profileShow || profileShow.interests" cols="12" md="6">
              <v-card-title> INTERESTS </v-card-title>
              <v-chip-group
                class="px-5"
                v-if="profile.interests && profile.interests.length"
                multiple
                column
              >
                <v-chip
                  class="text-truncate"
                  v-for="(interest, index) in profile.interests"
                  :key="index"
                  :value="interest"   
                >
                  {{interest}}
                </v-chip>
              </v-chip-group>
              <v-card-text v-else>
                <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Spinner from '@/components/LoadingSpinner'
export default {
  components: {Spinner},
  name: 'Post',
  props: {
    profile: {
      type: Object,
      required: true
    },
    profileShow: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imgFailed:false
    }
  }
}
</script>