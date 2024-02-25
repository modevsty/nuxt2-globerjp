<template>
    <v-container v-if="!user">
      <h1>
        You must be logged in to view this page.
      </h1>
      <v-btn
        color="#2196F3"
        class="pa-0"
        style="text-transform: unset !important; font-size: 16px !important;"
        @click="handleJoin()"
        text
        >Click here to Join</v-btn
      >
    </v-container>
  <v-container v-else>
    <client-only>
    <v-row>
      <v-col>
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
      </v-col>
    </v-row>
      <!-- <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Registered Events
          </v-card-title>
          <v-card>
            <v-data-table
              :search="searchEvent"
              :hide-default-header="false"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :group-by.sync="groupBy"
              :group-desc.sync="groupDesc"
              height="300"
              :headers="[
              {text: 'Id',
              value: 'relevanceValue',
              width: '9%'},
              {text: 'Title',
              value: 'title',
              width: '32%'},
              {text: 'Date',
              value: 'startDateTime',
              width: '27%'},
              {text: 'Location',
              value: 'location',
              width: '32%'}]"
              :items="registeredEvents"
              :items-per-page="-1"
              class="elevation-1 event-table event-table-pc"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="searchEvent"
                  label="Search"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:body="{ items }">
                <tbody class="table-body d-flex justify-center align-center" v-if="!items.length">
                  <tr class="d-flex justify-center align-center">
                    <td style="font-size: 16px;" class="d-flex justify-center align-center">No Registered Events!</td>
                  <tr />
                </tbody>
                <tbody v-else class="table-body">
                  <tr
                    v-for="item in items"
                    :key="'pc'+item.id"
                    class="table-row-pc"
                    @click="handleClick(item)"
                    style="cursor: pointer"
                  >
                    
                    <td style="width: 9%">
                      <v-card-text >{{item.relevanceValue}}</v-card-text>
                    </td>
                    <td style="width: 32%">
                      <v-card-text >{{item.title}}</v-card-text>
                    </td>
                    <td style="width: 27%">
                      <v-card-text >{{item.startDT}}</v-card-text>
                    </td>
                    <td style="width: 32%">
                      <v-card-text >{{item.alteredLocation}}</v-card-text>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
            <v-data-table
              :footer-props="{
                itemsPerPageText: 'Rows',
                disableItemsPerPage: true
              }"
              :search="searchEvent"
              :hide-default-header="false"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :group-by.sync="groupBy"
              :group-desc.sync="groupDesc"
              :headers="[
              {text: 'Title',
              value: 'title',
              width: '35%'},
              {text: 'Date',
              value: 'startDT',
              width: '30%'},
              {text: 'Location',
              value: 'alteredLocation',
              width: '35%'}]"
              :items="registeredEvents"
              :items-per-page="2"
              class="elevation-1 event-table event-table-sp"
            >
              <template v-slot:footer>
                <v-text-field
                  v-model="searchEvent"
                  label="Search"
                  class="mx-4"
                ></v-text-field>
              </template>
              <template v-slot:body="{ items }">
                <tbody class="table-body d-flex justify-center align-center" v-if="!items.length">
                  <tr class="d-flex justify-center align-center">
                    <td style="font-size: 16px;" class="d-flex justify-center align-center">No Registered Events!</td>
                  <tr />
                </tbody>
                <tbody v-else class="table-body">
                  <tr
                    v-for="item in items"
                    :key="'sp'+item.id"
                    class="table-row-sp"
                    @click="handleClick(item)"
                  >
                    <div>
                      <td>
                        <v-card-text >Title</v-card-text>
                        <v-card-text >{{item.title}}</v-card-text>
                      </td>
                      <td>
                        <v-card-text>Date</v-card-text>
                        <v-card-text >{{item.startDT}}</v-card-text>
                      </td>
                      <td>
                        <v-card-text>Location</v-card-text>
                        <v-card-text>{{item.alteredLocation}}</v-card-text>
                      </td>
                    </div>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row> -->
    <v-row>
      <v-col>
        <!-- <v-row>
          <v-col class="d-flex justify-center pb-0">
            <div style="position: absolute; top:0;width: 100%;height:400px">
              <div
                class="d-flex justify-center"
                style="width: 100%; position: relative; overflow: hidden;height:400px;"

              >
                <v-img
                  v-if="isBackground"
                  :src="backgroundUrl"
                  style="object-fit: cover"
                  height="100%"
                  width="100%"
                />
                <img
                  v-else
                  style="object-fit: cover"
                  src="~/assets/images/default_background.jpg"
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
          </v-col>
        </v-row> -->
        <v-dialog v-model="backgroundDialog" offset-y max-width="400px">
          <template v-slot:activator="{ on }">
            <v-row>
              <v-col class="d-flex justify-center pb-0">
                <div style="position: absolute; top:0;width: 100%;height:400px">
                  <div
                    class="d-flex justify-center"
                    style="width: 100%; position: relative; overflow: hidden;height:400px;"
                    v-on="on"
                    @mouseover="hoverBackground = true"
                    @mouseleave="hoverBackground = false"
                  >
                    <div
                      v-if="hoverBackground"
                      style="opacity: 40%; background-color: #000; position:absolute;
                  left:0; right:0; margin:auto; width:100%; z-index:1; height: 100%;"
                    >
                      <v-icon
                        style="bottom: 0;
                            left: 0;
                            padding: 10px;
                            position: absolute;
                            color: white;"
                      >
                        mdi-camera
                      </v-icon>
                    </div>
                    <v-img
                      v-if="backgroundImage && backgroundImage.imageUrl || isChangingBackgroundImage"
                      :src="imgFailed? '/img/default_background.jpg':backgroundImage.imageUrl"
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
          </template>
          <v-card>
            <v-row style="width: inherit">
              <v-col>
                <v-file-input
                  v-if="uploadReadyBackground"
                  v-model="file"
                  id="fileIdBackground"
                  ref="fileInputBackground"
                  :rules="backgroundSizeRules"
                  class="ma-10"
                  :type="fileType"
                  :accept="acceptType"
                  label="Pick a new background"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :disabled="isCropping"
                @click="
                  () => {
                    backgroundDialog = false;
                  }
                "
              >
                cancel</v-btn
              >
              <v-btn
                color="primary"
                @click="
                  () => {
                    saveNewUserImage(1);
                    backgroundDialog = false;
                  }
                "
              >
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <div style="padding-top: 160px">
      <v-row>
        <v-col>
          <!-- <v-row>
            <v-col class="d-flex justify-center pb-0">
              <div
                class="d-flex justify-center"
                style="width: fit-content; position: relative; z-index: 100; border: 5px solid white"
              >
                <v-img
                  v-if="isAvatar"
                  :src="avatarUrl"
                  max-height="200"
                  max-width="200"
                />
                <img
                  v-else
                  src="~/assets/images/default_profile.png"
                  max-height="200"
                  max-width="200"
                />
              </div>
            </v-col>
          </v-row> -->
                <input
                  :ref="`fileInputAvatar`"
                  type="file"
                  style="display:none;"
                  :accept="acceptType"
                  @click="e=>{removeInputAvatarFile();}"
                  @change.prevent="
                    avatarMiddleware($event.target.files)
                  "
                />
          <div>
            <v-row>
              <v-col class="d-flex justify-center pb-0" style="margin-top: 30px;">
                <div
                  class="d-flex justify-center"
                  style="width: fit-content; position: relative; z-index: 100; border: 5px solid white"
                  v-on:click="e=>{launchAvatarImageFile();}"
                  @mouseover="hoverAvatar = true"
                  @mouseleave="hoverAvatar = false"
                >
                  <div
                    v-if="hoverAvatar"
                    style="opacity: 40%; background-color: #000; position:absolute;
                left:0; right:0; margin:auto; width:100%; height: 100%;z-index:200"
                  >
                    <v-icon
                      style="bottom: 0;
                          left: 0;
                          padding: 10px;
                          position: absolute;
                          color: white;"
                    >
                      mdi-camera
                    </v-icon>
                  </div>
                  <v-img
                    v-if="avatarImage && avatarImage.imageUrl"
                    :src="imgFailed? '/img/default_profile.png':avatarImage.imageUrl"
                    @error="imgFailed=true"
                    lazy-src="/img/default_profile.png"
                    height="200"
                    width="200"
                    style="object-fit: cover;"
                  />
                  <v-img
                    v-else
                    src="/img/default_profile.png"
                    height="200"
                    width="200"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-center text-center pa-0">
                <v-card-title>
                  {{ firstName+" "+lastName}}
                </v-card-title>
              </v-col>
            </v-row>
          </div>
          <v-dialog :persistent="isCropping" v-model="avatarDialog" offset-y max-width="600px" max-height="350px">
            <v-card class="d-flex flex-column justify-center align-center">
              <v-row class="ma-0" style="width: 100%;">
                <v-col class="d-flex justify-center pa-0">
                  <client-only>
                    <AvatarCropper  @isCropping="isCroppingHandler" :imgSrcIn="imgSrc" :index="0" :fileType="fileImageCropper.type" :fileName="fileImageCropper.name" :fileWidth="fileImageCropper.width" :fileHeight="fileImageCropper.height" @cropImg="cropAvatarEventHandler" />
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
                      avatarDialog = false;
                      $forceUpdate()
                    }
                  "
                >
                  cancel</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Registered Events (Calendar)
          </v-card-title>
          <v-card class="d-flex justify-center align-center">
            <Calendar class="mb-1" style="max-width: 100%; overflow: hidden" v-model="registeredEvents" />
          </v-card>
        </v-col>
      </v-row>
      <!-- <v-row>
        <client-only>
        <v-col>
          <v-card-title class="font-weight-bold">
            Add Event Photos
          </v-card-title>
          <v-card class="pa-5 event-photos-card" >
            <v-card-title class="pa-0 py-2" style="word-break:break-word">
              Select a Registered Event
            </v-card-title>
            <v-select
              v-if="isMobileScreen"
              v-model="selectedEvent"
              :items="registeredEvents"
              item-text="title"
              return-object
              @change="getEventImages"
              label="Select an Event"
            ></v-select>
            <v-autocomplete
              v-else
              v-model="selectedEvent"
              :items="registeredEvents"
              item-text="title"
              return-object
              @change="getEventImages"
              :menu-props="{closeOnClick:true}"
              label="Select an Event"
            ></v-autocomplete>
            <ImageUploader v-if="eventImages" v-model="eventImages" />
          </v-card>
        </v-col>
        </client-only>
      </v-row> -->
      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Basic Information
          </v-card-title>
          <v-card class="pa-3">
            <v-dialog
              v-model="newInfoDialog"
              offset-y
              style="float:right"
              max-width="min(100%,950px)"
              scrollable
            >
              <template v-slot:activator="{ on }">
                <v-row>
                  <v-col class="pb-5 pb-sm-0 d-flex justify-space-between justify-sm-end">
                    <v-btn nuxt :to="`/profile/${user.uid}`" color="grey lighten-3 black--text mr-3" dark>
                      <v-icon small>
                        mdi-eye
                      </v-icon>
                      &nbsp;Preview
                    </v-btn>
                  <!-- </v-col>
                  <v-col class="pb-0"> -->
                    <v-btn @click="fillForm"  color="primary" dark v-on="on">
                      <v-icon small>
                        mdi-pencil
                      </v-icon>
                      &nbsp;Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <v-card style="height:fit-content">
                <v-card-title>
                  <span style="word-break:break-word" class="headline">
                    Update Basic Info
                  </span>
                </v-card-title>
                <v-form
                  ref="bioform"
                  class="pa-4 pt-30"
                  v-model="validBasic"
                  lazy-validation
                >
                  <v-container style="max-width:min(100%,950px)">
                    <v-row>

                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="tempForm.firstName"
                          :rules="firstNameRules"
                          label="First Name"
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="tempForm.lastName"
                          :rules="lastNameRules"
                          label="Last Name"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="tempForm.nickName"
                          :rules="nickNameRules"
                          label="Nick Name"
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="tempForm.email"
                          disabled
                          label="E-mail"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-select
                          v-if="isMobileScreen"
                          v-model="tempForm.country"
                          :rules="[v => !!v || 'Country is required']"
                          :items="countries"
                          required
                          label="Country"
                        ></v-select>
                        <v-autocomplete
                          v-else
                          :menu-props="{closeOnClick:true}"
                          v-model="tempForm.country"
                          :rules="[v => !!v || 'Country is required']"
                          :items="countries"
                          required
                          label="Country"
                        ></v-autocomplete>

                      </v-col>
                      <v-col style="position:relative" v-if="universityFound" class="pt-6 pt-md-3 pb-6 pb-md-6" cols="12" md="6" sm="12">
                        <p class="treeselect-title">University</p>
                        <treeselect v-model="tempForm.university" 
                          :required="true"
                          :clearable="!isMobileScreen"
                          :searchable="!isMobileScreen"
                          :disable-branch-nodes="true"
                          :show-count="true"
                          placeholder="Select University..." 
                          :max-height="200"
                          :options="universitiesTree" />
                      </v-col>
                      <v-col v-if="!universityFound" class="py-0" cols="10" md="5">
                        <v-text-field
                          required
                          :rules="[v => !!v || 'University is required']"
                          v-model="tempForm.university"
                          label="University"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="!universityFound" class="py-0" cols="2" md="1">
                          <v-checkbox
                          :on-icon="'mdi-dots-horizontal'"
                          :off-icon="'mdi-dots-horizontal'"
                          style="float:right;"
                          v-model="universityFound"
                          >
                          </v-checkbox>
                      </v-col>


                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-select
                          required
                          :rules="[v => !!v || 'Degree is required']"
                          v-model="tempForm.degree"
                          :items="degrees"
                          label="Pursuing Degree"
                        ></v-select>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-select
                          required
                          :rules="[v => !!v || 'Expected Graduation Year is required']"
                          v-model="tempForm.expectedGraduationYear"
                          :items="expectedGraduationYears"
                          label="Expected Year of Graduation"
                        ></v-select>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-text-field
                          v-model="tempForm.major"
                          :rules="[v => !!v || 'Major is required']"
                          label="Major"
                        ></v-text-field>
                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-menu
                          required
                          v-model="menuDateOfEntry"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="
                                tempForm.dateOfEntry
                              "   
                              :rules="[v => !!v || 'Date of Entry into Japan is required' ]"
                              label="Date of Entry into Japan"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="
                              tempForm.dateOfEntry
                            "
                            type="month"
                            @input="
                              menuDateOfEntry = false;
                            "
                          ></v-date-picker>
                        </v-menu>

                      </v-col>
                      <v-col class="py-0" cols="12" md="6" sm="12">
                        <v-select
                          v-model="tempForm.interests"
                          :items="majors"
                          :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached }"
                          label="Interests"
                          v-on:input="limiter"
                          multiple
                          clearable
                          hint="Select upto 5 interests"
                          persistent-hint>
                          <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                            <span
                              v-if="index === selectMaxDisplay"
                              class="grey--text caption"
                            >(+{{ tempForm.interests.length - selectMaxDisplay }} interests)</span>
                          </template>
                        </v-select>
          
                      </v-col>
                      <v-col cols="12" md="6" sm="12">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" text @click="newInfoDialog = false">
                            Cancel</v-btn
                          >
                          <v-btn
                            color="primary"
                            :disabled="!validBasic"
                            @click="
                              () => {
                                validateSubmit();
                              }
                            "
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                      <!-- <v-col cols="12" md="6" sm="6">
                        <v-btn
                          :disabled="!valid"
                          color="blue accent--text"
                          class="mr-4"
                          @click="validateSubmit"
                        >
                          Validate
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="6" sm="6" class="d-flex justify-md-end justify-sm-end">
                        <v-btn
                          color="white primary--text"
                          nuxt-link
                          to="/dashboard"
                        >
                          Go back
                        </v-btn>
                      </v-col>  -->
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
            </v-dialog>
            <v-row class="py-5 pt-0">
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width: 100%;" >
                <v-card-title class="d-flex justify-space-between pb-4"> NICK NAME&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.nickName"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.nickName">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="nickName">
                  <div style="color:#000;font-size:18px;">
                    {{ nickName }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> REAL NAME&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.realName"
                  :disabled="settingProfileHide"
                  color="grey darken-2"
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.realName" class="primary--text">Public</span>
                  <span  v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="firstName || lastName">
                  <div style="color:#000;font-size:18px;">
                    {{ firstName + ' ' + lastName }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> EMAIL&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.email"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.email" >Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="email">
                  <div style="color:#000;font-size:18px;">
                    {{ email }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> COUNTRY&nbsp;&nbsp;              
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.country"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.country">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="country">
                  <div style="color:#000;font-size:18px;">{{ country }}</div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> UNIVERSITY&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.university"
                  :disabled="settingProfileHide"
                  color="grey darken-2"
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.university" class="primary--text">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="university && university.replace(/\s/g, '').length">
                  <div style="color:#000;font-size:18px;">
                    {{ university }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title style="word-break: break-word"  class="d-flex justify-space-between pb-4 flex-nowrap"> <div stye="flex: 1">EXPECTED GRADUATION YEAR&nbsp;&nbsp;</div>
                <v-checkbox
                  class="mt-0 pl-3 pt-0"
                  hide-details
                  v-model="tempFormShow.expectedGraduationYear"
                  :disabled="settingProfileHide"
                  color="grey darken-2"
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.expectedGraduationYear" class="primary--text">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="expectedGraduationYear">
                  <div style="color:#000;font-size:18px;">{{ expectedGraduationYear }}</div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> DEGREE&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.degree"
                  :disabled="settingProfileHide"
                  color="grey darken-2"
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.degree" class="primary--text">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="degree">
                  <div style="color:#000;font-size:18px;">
                    {{ degree }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> MAJOR&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.major"
                  :disabled="settingProfileHide"
                  color="grey darken-2"
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.major" class="primary--text">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="major && major.replace(/\s/g, '').length">
                  <div style="color:#000;font-size:18px;">{{ major }}</div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title style="word-break: break-word"  class="d-flex justify-space-between pb-4 flex-nowrap"> <div stye="flex: 1"> DATE OF ENTRY INTO JAPAN&nbsp;&nbsp;</div>               
                <v-checkbox
                  class="mt-0 pl-3 pt-0"
                  hide-details
                  v-model="tempFormShow.dateOfEntry"
                  :disabled="settingProfileHide"
                  on-icon="mdi-earth"
                  color="grey darken-2"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.dateOfEntry" class="primary--text">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="dateOfEntry && dateOfEntry.replace(/\s/g, '').length">
                  <div style="color:#000;font-size:18px;">{{ dateOfEntry }}</div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex py-2">
                <div style="width:100%;">
                <v-card-title  class="d-flex justify-space-between pb-4"> INTERESTS&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="tempFormShow.interests"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.interests">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                
                </v-card-title>
                <v-chip-group
                  class="px-5"
                  v-if="interests && interests.length"
                  multiple
                  column
                >
                  <v-chip
                    class="text-truncate"
                    v-for="(interest, index) in interests"
                    :key="index"
                    :value="interest"   
                  >
                    {{interest}}
                  </v-chip>
                </v-chip-group>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="isAccountComplete">
        <v-col>
          <v-card-title class="font-weight-bold">
            Language Information
          </v-card-title>
          <v-card class="pa-3">
            <v-dialog
              v-model="newLangDialog"
              offset-y
              style="float:right"
              max-width="min(100%,950px)"
              scrollable
            >
              <template v-slot:activator="{ on }">
                <v-row v-if="isAccountComplete">
                  <v-col class="pb-5 pb-sm-0 d-flex justify-space-between justify-sm-end">
                    <v-btn nuxt :to="`/learners/learner/${user.uid}`" color="grey lighten-3 black--text mr-3" dark>
                      <v-icon small>
                        mdi-eye
                      </v-icon>
                      &nbsp;Preview
                    </v-btn>
                  <!-- </v-col>
                  <v-col class="pb-0"> -->
                    <v-btn @click="fillFormLanguage"  color="primary" dark v-on="on">
                      <v-icon small>
                        mdi-pencil
                      </v-icon>
                      &nbsp;Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <v-card style="height:fit-content">
                <v-card-title>
                  <span style="word-break:break-word" class="headline">
                    Update Language Info
                  </span>
                </v-card-title>
                <v-form
                  ref="languageform"
                  class="pa-4 pt-30"
                  v-model="validLearning"
                  lazy-validation
                >
                  <v-container style="max-width:min(100%,950px)">
                    <v-row>
                      <v-col class="py-1" cols="12" md="6" sm="12">
                        <v-textarea
                          v-model="tempForm.bio"
                          placeholder="say something about yourself..."
                          rows="6"
                          :rules="[v=> !!v && v.length < 200 || 'Must be less than 200 characters.']"
                          label="About me"
                        ></v-textarea>
                      </v-col>

                      <v-col class="pb-1 " cols="12" md="6" sm="12">
                        <v-menu
                          v-model="menuBirthDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="
                                tempForm.birthDate
                              "
                              class="pt-0 pb-5"
                              :rules="required"
                              label="Birth Date"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="
                              tempForm.birthDate
                            "
                            
                            @input="
                              menuBirthDate = false;
                            "
                          ></v-date-picker>
                        </v-menu>
                        <v-select
                          :items="genders"
                          label="Gender"
                          v-model="tempForm.gender"
                          item-text="text"
                          item-value="value"
                          dense
                        ></v-select>
                        <v-checkbox
                          v-model="tempForm.availability"
                          :label="`Available to be contacted? ${tempForm.availability && tempForm.availability? 'Yes' : 'No' || 'No'}`"
                        ></v-checkbox>
                      </v-col>
                      <v-col class="py-1" cols="12" md="6" sm="12">
                        <v-select
                          v-model="tempForm.knows"
                          @change="updateLanguageLevel"
                          :items="languages"
                          :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached}"
                          label="Languages I know"
                          v-on:input="limiter"
                          :rules="[(v) => v.length>0 || 'At least one language is required']"
                          multiple
                          clearable
                          hint="Select upto 5 languages"
                          persistent-hint>
                          <!-- <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                            <span
                              v-if="index === selectMaxDisplay"
                              class="grey--text caption"
                            >{{ tempForm.knows && tempform.knows.length? '(' + tempForm.knows.length - selectMaxDisplay + 'languages)': '' }} 
                            </span>
                          </template> -->
                        </v-select>
                      </v-col>

                      <v-col class="py-1" cols="12" md="6">
                        <v-select
                          v-model="tempForm.learning"
                          @change="updateLanguageLevel"
                          :items="languages"
                          :menu-props="{ top: true, offsetY: true, closeOnClick: limitReached, closeOnContentClick: limitReached}"
                          label="Languages I want to learn"
                          v-on:input="limiter"
                          :rules="[(v) => v.length>0 || 'At least one language is required']"
                          multiple
                          clearable
                          hint="Select upto 5 languages"
                          persistent-hint>
                          <!-- <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < selectMaxDisplay">{{ (item.length > 30) ? `${item.substr(0,30)}...` : item }}</v-chip>
                            <span
                              v-if="index === selectMaxDisplay"
                              class="grey--text caption"
                            >{{ tempForm.knows && tempform.knows.length? '(' + tempForm.knows.length - selectMaxDisplay + 'languages)': '' }} 
                            </span>
                          </template> -->
                        </v-select>

                      </v-col>
                      <v-col class="pt-5" v-if="tempForm.knows || tempForm.learning" cols="12">
                        <v-row>
                          <v-col 
                          v-for="language of combinedLanguages" 
                          :key="language" cols="12" md="6">
                            <!-- <v-subheader> {{ language }}</v-subheader> -->
                              <v-slider
                                :label="language"
                                v-model="tempForm.languageLevel[language]"
                                @change="e=>setTickLabelsArray(language, e)"
                                :tick-labels="tickLabelsArray[language]"
                                :max="3"
                                step="1"
                                ticks="always"
                                tick-size="4"
                              ></v-slider>
                              <!-- <div style="color:#000;font-size:18px;">{{ profile.knows[language] }}</div> -->
                          </v-col>
                          <!-- <v-col 
                          v-for="language of tempForm.learning" 
                          :key="language" cols="12" md="6">
                              <v-slider
                                :label="language"
                                v-model="tempForm.languageLevel[language]"
                                :tick-labels="tickLabelsArray(tempForm.languageLevel[language])"
                                :max="3"
                                step="1"
                                ticks="always"
                                tick-size="4"
                              ></v-slider>
                          </v-col> -->
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6" sm="12">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" text @click="newLangDialog = false">
                            Cancel</v-btn
                          >
                          <v-btn
                            color="primary"
                            :disabled="!validLearning"
                            @click="
                              () => {
                                validateLanguageSubmit();
                              }
                            "
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
            </v-dialog>
            <v-row class="py-5 pt-0">
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width: 100%;" >
                <v-card-title class="d-flex justify-space-between pb-4"> AGE&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="birthDate"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.nickName">Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="birthDate">
                  <div style="color:#000;font-size:18px;">
                    {{ getAgeGroupFromDOB(birthDate) }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between py-2">
                <div style="width:100%;">
                <v-card-title class="d-flex justify-space-between pb-4"> GENDER&nbsp;&nbsp;               
                <v-checkbox
                  class="mt-0 pt-0"
                  hide-details
                  v-model="gender"
                  disabled
                  on-icon="mdi-earth"
                  off-icon="mdi-lock"
                >
                <!-- <template v-slot:label>
                  <span v-if="tempFormShow.email" >Public</span>
                  <span v-else>Only me</span>
                </template> -->
                </v-checkbox>
                </v-card-title>
                <v-card-text v-if="gender">
                  <div style="color:#000;font-size:18px;">
                    {{ gender[0].toUpperCase() + gender.substring(1) }}
                  </div>
                </v-card-text>
                <v-card-text v-else>
                  <div style="color:#000;font-size:18px;">{{ "N/A" }}</div>
                </v-card-text>
                </div>
              </v-col>


              <v-col cols="12" md="6" class="py-2">
                <v-row v-if="knows && knows.length">
                  <v-col cols="12" class="pb-0 d-flex justify-space-between py-2">
                    <v-card-title class="d-flex justify-space-between pb-4" style="width:100%;">
                      Language/s I know &nbsp;&nbsp;
                      <v-checkbox
                        class="mt-0 pt-0"
                        hide-details
                        v-model="knows.length"
                        disabled
                        on-icon="mdi-earth"
                        off-icon="mdi-lock"
                      >
                      </v-checkbox>
                    </v-card-title>
                  </v-col>
                  <v-col class="pt-0" v-for="language of knows" :key="language" cols="12">
                    <!-- <v-subheader> {{ language }}</v-subheader> -->
                    <v-card-text class="py-0">
                      <v-slider
                        :label="language"
                        v-model="languageLevel[language]"
                        :tick-labels="staticTickLabelsArray(languageLevel[language])"
                        :max="3"
                        step="1"
                        ticks="always"
                        tick-size="4"
                        readonly
                      ></v-slider>
                      <!-- <div style="color:#000;font-size:18px;">{{ profile.knows[language] }}</div> -->
                    </v-card-text>
                  </v-col>
                </v-row>

                <v-row  v-if="learning && learning.length">
                  <v-col cols="12" class="pb-0 d-flex justify-space-between py-2">
                    <v-card-title class="d-flex justify-space-between pb-4 flex-nowrap" style="width:100%; word-break:break-word;">
                      <div style="flex:1">Language/s I want to practice &nbsp;&nbsp;</div>
                      <v-checkbox
                        class="mt-0 pt-0"
                        hide-details
                        v-model="learning.length"
                        disabled
                        on-icon="mdi-earth"
                        off-icon="mdi-lock"
                      >
                      </v-checkbox>
                    </v-card-title>
                  </v-col>
                  <v-col class="pt-0" v-for="language of learning" :key="language" cols="12">
                    <!-- <v-subheader> {{ language }}</v-subheader> -->
                    <v-card-text class="py-0">
                      <v-slider
                      :label="language"
                        v-model="languageLevel[language]"
                        :tick-labels="staticTickLabelsArray(languageLevel[language])"
                        :max="3"
                        step="1"
                        ticks="always"
                        tick-size="4"
                        readonly
                      >
                      <template slot="thumb-label" slot-scope="props">
                        <span style="font-size:12px;">
                        {{ props.value }}
                        </span>
                      </template>
                      </v-slider>
                      <!-- <div style="color:#000;font-size:18px;">{{ profile.learning[language] }}</div> -->
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="py-2">
                <v-row  v-if="bio">
                  <v-col cols="12" class="pb-0">
                    <v-card-title class="pb-4 d-flex justify-space-between" style="width:100%">
                      AVAILABILITY &nbsp;&nbsp;
                      <v-checkbox
                        class="mt-0 pt-0"
                        hide-details
                        v-model="birthDate"
                        disabled
                        on-icon="mdi-earth"
                        off-icon="mdi-lock"
                        >
                      </v-checkbox>
                    </v-card-title>                    
                    <v-card-text class="pt-0 d-flex" v-if="availability">
                      <div style="font-size:18px;" class="black--text"> Looking for Language partners
                      </div>
                    </v-card-text>
                    <v-card-text class="pt-0 d-flex" v-if="!availability">
                      <div style="font-size:18px;" class="black--text"> Currently unavailable
                      </div>
                    </v-card-text>
                  </v-col>

                  <v-col cols="12" class="pb-0">
                    <v-card-title class="pb-4 d-flex justify-space-between" style="width:100%">
                      ABOUT ME &nbsp;&nbsp;
                      <v-checkbox
                          class="mt-0 pt-0"
                          hide-details
                          v-model="bio"
                          disabled
                          on-icon="mdi-earth"
                          off-icon="mdi-lock"
                        >
                      </v-checkbox>
                    </v-card-title>
                    <v-card outlined class="mx-3">
                      <v-card-text>
                        {{bio}}
                      </v-card-text>
                    </v-card>
                  </v-col>

                </v-row>
              </v-col>
              
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title class="font-weight-bold">
            Useful Tools
          </v-card-title>
          <v-card class="pa-5">
            <v-row>
              <v-col cols="12" md="6" sm="12" class="d-flex justify-space-between flex-column py-2">
                <div class="py-2 text-body-1 d-flex justify-start align-center" style="width: 100%;">
                  Resume Builder
                  <nuxt-link to="/tools/resume-builder">
                    <v-icon medium color="primary">mdi-open-in-new</v-icon>
                  </nuxt-link>
                </div>
                <div class="py-2 text-body-1 d-flex justify-start align-center" style="width: 100%;">
                  Search for Language partner
                  <nuxt-link to="/learners">
                    <v-icon medium color="primary">mdi-open-in-new</v-icon>
                  </nuxt-link>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
    </client-only>
  </v-container>
</template>
<script>
import moment from 'moment'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { cloneDeep, isEqual } from 'lodash'
import fixtures from "@/fixtures/fixtures.json"
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import Spinner from '@/components/LoadingSpinner'
import Calendar from '@/components/Calendar'
import ImageCropper from '@/components/ImageCropper'
import AvatarCropper from '@/components/AvatarCropper'
export default {
  head() {
    return { title: (this.firstName.trim() && 'glober dashboard | '+ (this.firstName+" "+this.lastName)) || 'glober dashboard'}  
  },
  middleware: "auth",
  components: { Spinner, Calendar, ImageCropper, Treeselect, AvatarCropper },
  layout: "default",
  name: "profile",
  data() {
    return {
      tickLabelsArray: {},
      selectedIndex: null,
      universityFound: true,
      confirmDialog: false,
      isCropping: false,
      isLoading: [],
      fileImageCropper: {name: '', type:'', width: 0, height: 0},
      imgSrc: null,
      settingProfileHide: false,
      initialSetupProfileShow: true,
      searchEvent: "",
      imgFailed:false,
      selectMaxDisplay: 1,
      groupBy: '',
      groupDesc: true,
      sortBy: 'relevanceValue',
      sortDesc: false,
      registeredEvents: [],
      validBasic: true,
      validLearning: true,
      pageLoaded: false,
      uploadReadyAvatar: true,
      uploadReadyBackground: true,
      hoverAvatar: false,
      cropDialog: [],
      avatarDialog: false,
      hoverBackground: false,
      backgroundDialog: false,
      newInfoDialog: false,
      newLangDialog: false,
      error: null,
      success: null,
      avatarImage: {imageUrl: '', teaserImageUrl: ''},
      backgroundImage: {imageUrl: '', teaserImageUrl: ''},
      file: null,
      avatarFile: null,
      backgroundFile: null,
      fileType: "file",
      acceptType: "image/*",
      isAvatar: false,
      isBackground: false,
      isChangingAvatarImage: false,
      isChangingBackgroundImage: false,
      isUploadingAvatarImage: false,
      isUploadingBackgroundImage: false,
      isDeletingAvatarImage: false,
      isDeletingBackgroundImage: false,
      tempForm: {},
      tempFormShow: {},
      tempFormShowPrev: null,
      nickName: "",
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      university: "",
      degree: "",
      major: "",
      interests: [],
      dateOfEntry: "",
      expectedGraduationYear: "",
      avatarSizeRules: [
        value =>
          !value ||
          value.size < 20000000 ||
          "Avatar size should be less than 20 MB!"
      ],
      backgroundSizeRules: [
        value =>
          !value ||
          value.size < 20000000 ||
          "Background size should be less than 20 MB!"
      ],
      expectedGraduationYears: (function() {
          let year = new Date().getFullYear();
          return Array.from({length: 12}, (_, i) => i + year)}
        )(),
      majorRules: [],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      nickNameRules: [
        // v => !!v && !!v.replace(/\s/g, '').length || 'Nick Name is required',
        v => v.length <= 20 || 'Name must be less than 20 characters',
      ],
      firstNameRules: [
        v => !!v && !!v.replace(/\s/g, '').length || 'First Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      lastNameRules: [
        v => !!v || 'Last Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      countries: fixtures.countries,
      degrees: fixtures.degrees,
      universities: fixtures.universities,
      universitySet: new Set(fixtures.universities),
      majors: fixtures.majors,
      selectedEvent: {},
      eventImages: null,
      FULL_IMAGE: {
        maxDimension: 1280,
        quality: 0.9
      },
      THUMB_IMAGE: {
        maxDimension: 640,
        quality: 0.7
      },
      menuDateOfEntry: false,
      birthDate: '',
      bio: '',
      gender: 'male',
      knows: [],
      languageLevel: {},
      learning: [],
      availability: true,
      languageLabels: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Native',
        ],
      tickLabels: [
        '',
        '',
        '',
        ''
      ],
      menuBirthDate: false,
      required: [value => !!value || 'Required Field'],
      languages: [
        'English',
        'Japanese',
        'Chinese (Mandarin)',
        'Chinese (Cantonese)',
        'Korean',
        'Hindi',
        'Spanish',
        'French',
        'German'
      ],
      genders: [
        {value: '', text: 'Prefer not to say'},
        {value: 'male', text: 'Male'},
        {value: 'female', text: 'Female'}
      ],
    };
  },
  computed: {
    isAccountComplete() {
      return this.account.birthDate
    },
    universitiesTree() {
      const universitiesTree = {}
      const alphabets = [...Array(26)].map((_, i) => String.fromCharCode(i + (65)));
      alphabets.forEach(e => {
        universitiesTree[e] = {
          id : e,
          label: e,
          children: []
        }
      })
      this.universities.forEach(e => {
        universitiesTree[e[0]].children.push({
          id: e,
          label: e
        })
      })
      const universitiesArray = Object.values(universitiesTree)
      universitiesArray.push({
        id: 'other',
        label: 'other'
      })
      return universitiesArray
    },
    limitReached() {
      if(this.tempForm && this.tempForm.interests && this.tempForm.interests.length == 5) {
        return true
      }
      if(this.tempForm && this.tempForm.knows && this.tempForm.knows.length == 5) {
        return true
      }
      if(this.tempForm && this.tempForm.learning && this.tempForm.learning.length == 5) {
        return true
      }
      return false
    },
    itemsPerPage() {
      if(process.browser) {
        if(this.isMobileScreen) {
          return 5
        } else {
          return 5
        }
      }
    },
    combinedLanguages() {
      if (!this.tempForm.knows && !this.tempForm.learning) {
        return []
      }
      return [...new Set([...(this.tempForm.knows || []), ...(this.tempForm.learning || [])])]
    },
    isSmallScreen() {
      if (process.browser) {
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return (window.innerWidth > 900) ? false : true 
      }
      return true
    },
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
    user() {
      return this.$store.state.authUser
    },
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    isDeletingImage() {
      if (!this.eventImages.images) return [];
      const isDeletingImage = this.eventImages.images.map((_) => false);
      return isDeletingImage;
    },
    isUploadingImage() {
      if (!this.eventImages.images) return [];
      const isUploadingImage = this.eventImages.images.map((_) => false);
      return isUploadingImage;
    },
  },
  async mounted() {
    await this.getInfo();
    await this.getRegisteredEvents();
  },
  // watch: {
  //   deep: true,
  //   selectedEvent() {
  //     console.log(this.selectedEvent)
  //   },
  //   eventImages() {
  //     console.log("eventImages",this.eventImages)
  //   }
  // },
  watch: {
    tempForm: {
      deep: true,
      handler(val) {
        if (val.university === 'other') {
          this.universityFound = false
          this.tempForm.university = ""
        }
      }
    },
    universityFound(val) {
      if (val) {
         this.tempForm.university = null
      }
    },
    async $route(to, from) {
      if (to.name === 'dashboard') {
          await this.getInfo();
          await this.getRegisteredEvents();
      }
    },
    tempFormShow: {
      async handler(val, old) {

        if (!this.tempFormShowPrev) {
          this.settingProfileHide = true
          this.tempFormShowPrev = cloneDeep(val)
          let data = {
            profileShow: cloneDeep(val)
          }
          await this.$fire.firestore.collection("users").doc(this.user.uid).update(data).then(()=>{
            this.setAccountProfileshow(data)
          })
          this.settingProfileHide = false
          return
        };
        if (isEqual(this.tempFormShowPrev, val)) {
          this.tempFormShowPrev = cloneDeep(val)
          return
        };
        this.settingProfileHide = true
        // console.log('val', val)
        let data = {
          profileShow: cloneDeep(val)
        }
        try{
        await this.$fire.firestore.collection("users").doc(this.user.uid).update(data).then(()=>{
            this.success = "Successfully updated!!"
            this.setAccountProfileshow(data)
            this.settingProfileHide = false
            this.tempFormShowPrev = cloneDeep(val)

            setTimeout(()=>{
              this.success = null
            },2000)
          })
        } catch(error) {
          this.error = error || "Could not set user information visibility"
          this.settingProfileHide = false
          setTimeout(()=>{
            this.error = null
          },2000)
        }
      },
      deep: true,

      
    }
  },
  methods: {
    staticTickLabelsArray(level) {
      if (!this.isSmallScreen) {
        return this.languageLabels
      }
      let array = [...this.tickLabels]
      array[level] = this.languageLabels[level]
      return array
    },
    setTickLabelsArray(language,level) {
      if (!this.isSmallScreen) {
        this.tickLabelsArray[language] = this.languageLabels
        this.$forceUpdate()
        return
      }
      const array = [...this.tickLabels]
      array[level] = this.languageLabels[level]
      this.tickLabelsArray[language] = array
      this.$forceUpdate()
    },
    updateLanguageLevel(data) {
      data.map(e => {
        if(!this.tempForm.languageLevel.hasOwnProperty(e)) {
          this.tempForm.languageLevel[e] = 0
          this.setTickLabelsArray(e,0)
        }
      })
      this.$forceUpdate()
    },
    handleJoin() {
      localStorage.setItem('BEFORE_LOGIN_PATH', this.$route.path);
      this.$router.push({path: '/login'})
    },
    getAgeGroupFromDOB(value) {
      if(!value || !process.browser) {
        return ''
      }
      var date = moment(value);
      if (!date) {
        return ''
      }
      const years = moment().diff(value, 'years');
      switch (true) {
        case years < 25:
          return 'Under 25'
        case years < 35:
          return '25-34'
        case years < 46:
          return '35-45'
        default:
          return 'Over 45'
      }


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
    cropAvatarEventHandler(val) {
      this.avatarDialog = false
      this.$forceUpdate()
      this.imageSrc=''
      this.removeInputAvatarFile()
      const file = this.dataURLtoFile(val.img, val.fileName, val.fileType)
      this.file = file
      this.saveNewUserImage(0);
      // this.uploadImageFile([file],val.index)
    },
    cropImgEventHandler(val) {
      this.cropDialog[val.index] = false
      this.$forceUpdate()
      this.imageSrc=''
      this.removeInputImageFile(val.index)
      const file = this.dataURLtoFile(val.img, val.fileName, val.fileType)
      this.uploadImageFile([file],val.index)
    },
    // filterOnlyCapsText (value, search, item) {
    //     return value != null &&
    //       search != null &&
    //       typeof value === 'string' &&
    //       value.toString().toLocaleUpperCase().indexOf(search) !== -1
    //   },
    fillForm() {
      if (this.university && !this.universitySet.has(this.university)) {
        this.universityFound = false
      }
      this.tempForm = {
        nickName: this.nickName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        country: this.country,
        university: this.university? this.university : null,
        degree: this.degree,
        major: this.major,
        interests: this.interests,
        dateOfEntry: this.dateOfEntry,
        expectedGraduationYear: this.expectedGraduationYear,      }

    },
    fillFormLanguage() {
      this.tempForm = {
        birthDate: this.account.birthDate || '',
        bio: this.account.bio || '',
        gender: this.account.gender || '',
        knows: this.account.knows|| [],
        languageLevel: {...this.account.languageLevel} || {},
        learning: this.account.learning || [],
        availability: this.account.availability
      }
      Object.keys(this.tempForm.languageLevel).forEach(e => {
        this.setTickLabelsArray(e, this.tempForm.languageLevel[e])
      })
    },
    fillFromForm() {
      this.nickName = this.tempForm.nickName;
      this.firstName = this.tempForm.firstName;
      this.lastName = this.tempForm.lastName;
      this.email = this.tempForm.email;
      this.country = this.tempForm.country;
      this.dateOfEntry = this.tempForm.dateOfEntry;
      this.expectedGraduationYear = this.tempForm.expectedGraduationYear;
      this.major = this.tempForm.major;
      this.interests = this.tempForm.interests;
      this.university = this.tempForm.university;
      this.degree = this.tempForm.degree;
    },
    fillFromFormLanguage() {
      this.birthDate =  this.tempForm.birthDate;
      this.bio =  this.tempForm.bio;
      this.gender =  this.tempForm.gender;
      this.knows =  this.tempForm.knows;
      this.learning =  this.tempForm.learning;
      this.languageLevel = this.tempForm.languageLevel;
      this.availability =  this.tempForm.availability;
    },
    limiter(e) {
      if(e.length > 5) {
        e.pop()
      }
    },
    handleClick(value) {
      this.$router.push({path: `/event/${value.id}`})
    },
    onReset(name) {
      // this.file = null;
      // if (name === "Avatar") {
      //   this.uploadReadyAvatar = false;
      //   this.$nextTick(() => {
      //     this.uploadReadyAvatar = true;
      //   });
      // } else if (name === "Background") {
      //   this.uploadReadyBackground = false;
      //   this.$nextTick(() => {
      //     this.uploadReadyBackground = true;
      //   });
      // }
    },
    // onFilePicked(e) {
    //   this.file = e;
    //   console.log("avatar file", this.avatarFile)
    //   console.log("this file",this.file)
    //   // this.file = this.$refs.fileinput.files[0];
    //   // const filename = file.name;
    //   // if (filename.lastIndexOf(".") <= 0) {
    //   //   return alert("Pleaseaddavalidfile!");
    //   // }
    //   // const fileReader = new FileReader();
    //   // fileReader.addEventListener("load", () => {
    //   //   this.imageUrl = fileReader.result;
    //   // });
    //   // fileReader.readAsDataURL(file);
    //   // fileReader.onload=()=>{
    //   //   this.imageUrl = fileReader.result;
    //   // }
    //   // fileReader.readAsDataURL(this.file);
    // },
    async deleteAvatarImage() {
      this.isdeletingAvatarImage = true;
      const fullImageDeletePromise = this.$fire.storage
        .refFromURL(this.avatarImage.imageUrl)
        .delete();
      const thumbImageDeletePromise = this.$fire.storage
        .refFromURL(this.avatarImage.teaserImageUrl)
        .delete();

      return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
        .then(async () => {
          this.avatarImage.imageUrl = '';
          this.avatarImage.teaserImageUrl = '';
          await this.updateUserImageFirestore(0);
          return null;
        })
        .catch(async (error) => {
          // eslint-disable-next-line no-console
          console.error('Error deleting image', error);

          if (error.code === 'storage/object-not-found') {
            this.avatarImage.imageUrl = '';
            this.avatarImage.teaserImageUrl = '';
            await this.updateUserImageFirestore(0);
          }
        })
        .finally(() => {
          this.isdeletingAvatarImage = false;
        });
    },
    async deleteBackgroundImage() {
      this.isdeletingBackgroundImage = true;
      const fullImageDeletePromise = this.$fire.storage
        .refFromURL(this.backgroundImage.imageUrl)
        .delete();
      const thumbImageDeletePromise = this.$fire.storage
        .refFromURL(this.backgroundImage.teaserImageUrl)
        .delete();

      return Promise.all([fullImageDeletePromise, thumbImageDeletePromise])
        .then(async () => {
          this.backgroundImage.imageUrl = '';
          this.backgroundImage.teaserImageUrl = '';
          await this.updateUserImageFirestore(1);
          return null;
        })
        .catch(async (error) => {
          // eslint-disable-next-line no-console
          console.error('Error deleting image', error);

          if (error.code === 'storage/object-not-found') {
            this.backgroundImage.imageUrl = '';
            this.backgroundImage.teaserImageUrl = '';
            await this.updateUserImageFirestore(1);
          }
        })
        .finally(() => {
          this.isdeletingBackgroundImage = false;
        });
    },
    async saveNewUserImage(type) {
      // const file = files[0];
      if (type) {
        this.isChangingBackgroundImage = true
      } else {
        this.isChangingAvatarImage = true
      }
      

      if (!this.file || !this.file.type.match('image.*')) {
        // eslint-disable-next-line no-alert
        alert('Please upload an image.');
        this.isChangingBackgroundImage = false
        this.isChangingAvatarImage = false
        return;
      }

      const metadata = {
        contentType: this.file.type
      };

      const fullImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          this.file,
          this.FULL_IMAGE.maxDimension,
          this.FULL_IMAGE.quality,
          resolve
        );
      });

      const thumbImageResizePromise = new Promise((resolve, reject) => {
        this.generateVariation(
          this.file,
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

      const fullImageUploadPromise = this.uploadSingleUserImageFile(
        date + "_" + this.file.name,
        images[0],
        metadata,
        type
      );

      const thumbFileName =
        date + "_" +
        this.file.name.substring(0, this.file.name.lastIndexOf('.')) +
        '_thumb.' +
        this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
      const thumbImageUploadPromise = this.uploadSingleUserImageFile(
        thumbFileName,
        images[1],
        metadata,
        type
      );
      if (type) {
        if (this.backgroundImage.imageUrl !== "") {
          await this.deleteBackgroundImage().catch((err) => {
            console.log(err)
            return
          })
        }

        this.isUploadingBackgroundImage = true;

        await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
          .then(async (results) => {
            this.backgroundImage.imageUrl = results[0];
            this.backgroundImage.teaserImageUrl = results[1];
            await this.updateUserImageFirestore(1);
          })
          .finally(() => {
            this.isUploadingBackgroundImage = false;
            this.isChangingBackgroundImage = true
          });
      } else {
        if (this.avatarImage.imageUrl !== "") {
          await this.deleteAvatarImage().catch((err) => {
            console.log(err)
            return
          })
        }

        this.isUploadingAvatarImage = true;

        await Promise.all([fullImageUploadPromise, thumbImageUploadPromise])
          .then(async (results) => {
            this.avatarImage.imageUrl = results[0];
            this.avatarImage.teaserImageUrl = results[1];
            await this.updateUserImageFirestore(0);
          })
          .finally(() => {
            this.isUploadingAvatarImage = false;
            this.isChangingAvatarImage = true
          });
      }
      this.file = null;

      // const fd = new FormData();
      // fd.append("image", this.file, this.file.name);
      // await this.$axios
      //   .post(`v0/avatars/upload`, fd)
      //   .then(async response => {
      //     console.log(response.data.success);
      //     this.error = "";
      //     this.success = response.data.success;
      //     if (this.success !== "") {
      //       this.avatarUrl = response.data.avatarUrl;
      //       await this.FETCH_ACCOUNT();
      //     }
      //     this.newInfoDialog = false;
      //     await this.setAvatar(this.avatarUrl);
      //   })
      //   .catch(err => {
      //     this.success = "";
      //     this.error = err.response.data.error;
      //     console.log(this.error);
      //   });
    },
    async uploadSingleUserImageFile(filename, blob, metadata, type) {
      const storage = this.$fire.storage;
      if (type) {
        const imageRef = storage.ref(`userImages/${this.user.uid}/backgroundImage/${filename}`);
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
      } else {
        const imageRef = storage.ref(`userImages/${this.user.uid}/avatarImage/${filename}`);
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
      }
      

    },
    async updateUserImageFirestore(type) {
      try{
        let data = {
          backgroundImage: this.backgroundImage,
          avatarImage: this.avatarImage
        }

        await this.$fire.firestore.collection("users").doc(this.user.uid).update(data)
        .then(()=>{
          this.setAccountImages(data)
          this.success = "Successfully updated!!"
          setTimeout(()=>{
            this.success = null
          },2000)
        })
      } catch(error) {
        console.log(error)
        this.error = "Could not set user information"
        setTimeout(()=>{
          this.error = null
        },2000)
      }
    },
    async setAvatar(avatarUrl) {
      // this.avatarUrl = await this.fetchServiceUrl(avatarUrl);
      // if (this.avatarUrl !== null) {
      //   this.isAvatar = true;
      // } else {
      //   this.isAvatar = false;
      // }
    },
    async saveNewBackground() {
      // const fd = new FormData();
      // fd.append("image", this.file, this.file.name);
      // await this.$axios
      //   .post(`v0/backgrounds/upload`, fd)
      //   .then(async response => {
      //     console.log(response.data.success);
      //     this.error = "";
      //     this.success = response.data.success;
      //     if (this.success !== "") {
      //       this.backgroundUrl = response.data.backgroundUrl;
      //       await this.FETCH_ACCOUNT();
      //     }
      //     this.newInfoDialog = false;
      //     await this.setBackground(this.backgroundUrl);
      //   })
      //   .catch(err => {
      //     this.success = "";
      //     this.error = err.response.data.error;
      //     console.log(this.error);
      //   });
    },
    async setBackground(backgroundUrl) {
      // this.backgroundUrl = await this.fetchServiceUrl(backgroundUrl);
      // if (this.backgroundUrl !== null) {
      //   this.isBackground = true;
      // } else {
      //   this.isBackground = false;
      // }
    },
    // fetchServiceUrl(url) {
    // },
    ...mapActions({
      fetchAccount: 'account/FETCH_ACCOUNT'
    }),
    ...mapMutations({
      setAccount: 'account/SET_ACCOUNT',
      setAccountProfileshow: 'account/SET_ACCOUNT_PROFILESHOW',
      setAccountImages: 'account/SET_ACCOUNT_IMAGES'
    }),
    // async asyncData({ store, $fire }) {
    //   return {
    //     firstName: this.account.first
    //   }
    //   const post = await $http.$get(`https://api.nuxtjs.dev/posts/${params.id}`)
    //   return { post }
    // }

    async getInfo() {
      const account = this.account;
      this.tempFormShow = cloneDeep(account.profileShow);
      this.nickName = account.nickName;
      this.firstName = account.firstName;
      this.lastName = account.lastName;
      this.email = account.email;
      this.country = account.country;
      this.dateOfEntry = account.dateOfEntry;
      this.expectedGraduationYear = account.expectedGraduationYear;
      this.major = account.major;
      this.interests = account.interests;
      this.university = account.university;
      this.degree = account.degree;
      this.avatarImage = {imageUrl: account.avatarImage && account.avatarImage.imageUrl || '', teaserImageUrl: account.avatarImage && account.avatarImage.teaserImageUrl || ''};
      this.backgroundImage = {imageUrl: account.backgroundImage && account.backgroundImage.imageUrl || '', teaserImageUrl: account.backgroundImage && account.backgroundImage.teaserImageUrl || ''};

      this.birthDate = account.birthDate || '',
      this.bio = account.bio || '',
      this.gender = account.gender,
      this.knows = account.knows|| [],
      this.languageLevel = {...account.languageLevel} || {},
      this.learning = account.learning || [],
      this.availability = account.availability

    },
    async getRegisteredEvents() {
      let eventIds = await this.$fire.firestore.collection('entries')
      .where("userId","==",this.user.uid)
      .get()
      .then((querySnapshot) => {
        let out = []
        querySnapshot.forEach((res) => {
          let data = res.data()
          if (data && data.eventId) {
            out.push(
              data.eventId
            )
          }
        })
        return out
      })
      let promises = []
      for (let eventId of eventIds) {
        promises.push(this.$fire.firestore.collection('events').doc(eventId).get())
      }
      this.registeredEvents = await Promise.all(promises).then((querySnapshot) => {
        let out = []
        let todayDate = Date.now()
        querySnapshot.forEach(res => {
          let id = res.id
          let data = res.data()
          // console.log(data)
          
          // console.log(todayDate, date, todayDate > date)
          if (data && data.isPublished) {
            // let date = Date.parse(data.eventDateTo + "T" + data.eventTimeTo)
            out.push({
              id,
              ...data,
              // relevanceValue: date >= todayDate ? Number.POSITIVE_INFINITY : date,
              startDateTime: data.eventDateFrom + " " + data.eventTimeFrom,
              endDateTime: data.eventDateTo + " " + data.eventTimeTo,
              startDT: this.toWeekDateMin(data.eventDateFrom + "T" + data.eventTimeFrom),
              endDT: this.toWeekDateMin(data.eventDateTo + "T" + data.eventTimeTo),
              alteredLocation: data.location? data.location : (data.isOnline? 'Online' : 'N/A')
            })
          }
        })
        //unlock it for events
        if (out.length) {
          this.calculateRelevance(out)
        }
        return out
      })
    },
    calculateRelevance(eventArray) {
      
      let currDate = Date.now()
      let eventDateArray = eventArray.map(e=>Date.parse(e.eventDateTo + "T" + e.eventTimeTo))
      let max = eventDateArray.reduce((prev, curr) => Math.max(prev, curr), 0)
      eventArray.forEach((e,i)=>{
        let relevanceValue = eventDateArray[i] - currDate
        if (eventDateArray[i] > currDate) {
          relevanceValue = max + currDate - eventDateArray[i]
        }
        e.relevanceValue = relevanceValue
      })
      let sortedEventArray = eventArray.sort(function(a,b){return b.relevanceValue- a.relevanceValue})
      sortedEventArray.forEach((e,i) => {
        e.relevanceValue = i+1
      })
      eventArray = sortedEventArray
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
    async validateSubmit () {
      let isvalid = this.$refs.bioform.validate()

      if (this.universityFound && !this.tempForm.university) {
        this.universityFound = false
        this.$forceUpdate()
        this.$nextTick(()=> {
          this.$refs.bioform.validate()
          alert("University field must not be empty.")
        })
        return
      }

      const currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
            email: this.tempForm.email,
            country: this.tempForm.country,
            dateOfEntry: this.tempForm.dateOfEntry,
            expectedGraduationYear: this.tempForm.expectedGraduationYear,
            firstName: this.tempForm.firstName,
            lastName: this.tempForm.lastName,
            nickName: this.tempForm.nickName,
            major: this.tempForm.major,
            interests: this.tempForm.interests,
            university: this.tempForm.university,
            degree: this.tempForm.degree,
            createdAt: this.account.createdAt || currDate,
            updatedAt: currDate
          }
          await this.$fire.firestore.collection("users").doc(this.user.uid).update(data).then(()=>{
            this.fillFromForm()
            this.setAccount(data)
            this.success = "Successfully updated!!"
            // this.$parent.$children.forEach(e => {
            //   if (this._uid !== e._uid) {
            //     e.$destroy()
            //   }
            // })
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
        this.newInfoDialog = false;
        this.newLangDialog = false
      }
      // this.$refs.bioform.validate()
    },
    async validateLanguageSubmit () {
      let isvalid = this.$refs.languageform.validate()

      const currDate = Date.now().toString()
      if (isvalid) {
        try{
          let data = {
            birthDate: this.tempForm.birthDate,
            bio: this.tempForm.bio,
            gender:  this.tempForm.gender,
            knows:  this.tempForm.knows,
            learning:  this.tempForm.learning,
            languageLevel: this.tempForm.languageLevel,
            availability:  this.tempForm.availability,
            createdAt: this.account.createdAt || currDate,
            updatedAt: currDate
          }
          await this.$fire.firestore.collection("users").doc(this.user.uid).update(data).then(()=>{
            this.fillFromFormLanguage()
            this.setAccount(data)
            this.success = "Successfully updated!!"
            // this.$parent.$children.forEach(e => {
            //   if (this._uid !== e._uid) {
            //     e.$destroy()
            //   }
            // })
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
        this.newInfoDialog = false;
        this.newLangDialog = false
      }
      // this.$refs.languageform.validate()
    },
    async deleteImage(index) {
      this.isDeletingImage[index] = true;

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
    launchAvatarImageFile() {
      const file = `fileInputAvatar`;
      this.$refs[file].click();
    },
    removeInputImageFile(index) {
      const file = `imageFile${index}`;
      this.$refs[file][0].value = null
      // this.$refs[file][0].click();
    },
    removeInputAvatarFile() {
      const file = `fileInputAvatar`;
      this.$refs[file].value = null
      // this.$refs[file][0].click();
    },
    async avatarMiddleware(files) {
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
          this.avatarDialog = true
          this.$forceUpdate();
          reader = null
        }, false) 
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
    async uploadImageFile(files, index) {
      if (!files.length) {
        return;
      }
      this.isLoading[index] = true;
      this.isUploadingImage[index] = true;
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
          
        })
        .finally(() => {
          this.isUploadingImage[index] = false;
        });
      this.isLoading[index] = false;
      this.$forceUpdate()
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
    async removeImage() {
      // const confirmation = window.confirm('Are you sure?');
      // if (!confirmation) return;
      
      // console.log(confirmation);
      // const len = this.eventImages.images.length - 1
      // const index = len - reversedIndex
      const index = this.selectedIndex


      
      if (this.eventImages.images[index].imageUrl !== '') {
        await this.deleteImage(index);
        this.eventImages.images.splice(index, 1);
        this.cropDialog.splice(index, 1);
        this.isLoading.splice(index, 1)
        await this.updateImageFirestore();
       
      } else {
        this.eventImages.images.splice(index, 1);
      }

      // this.qualifications.forEach((qualification, index) => {
      //   qualification.id = index;
      // });
    },
  }
};
</script>
<style lang="scss">
.vue-treeselect__option-arrow-placeholder {
  @media screen and (max-width: 800px) {
    display: none;
  }
}
.v-autocomplete__content {
  max-height: 46vh !important;
}
</style>
<style lang="scss" scoped>
.treeselect-title {
  left: 5px; 
  top: 18px; 
  right: auto; 
  position: absolute; 
  color: rgba(0, 0, 0, 0.6);
  transform: translateY(-18px) scale(0.75);
  @media screen and (min-width: 960px) {
    top: 8px; 
  }
}
.button-style {
  border: thin solid rgba(0,0,0,0.5)
}
span {
  display:flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.cropper-view-box {
  img {
    display: none !important;
  }
}

.event-table-sp-small {
    @media screen and (min-width: 600px) {
      display: none;
    }
      .v-row-group__header {
    display: none
  }

}
.event-table-pc {
      @media screen and (max-width: 599px) {
        display: none;
      }
}
.event-table-sp {
      @media screen and (min-width: 600px) {
        display: none;
      }
}

.event-table {
    .v-data-table-header-mobile__wrapper {
      display: none;
    }
    background-color: #fff;
    .v-data-table__wrapper {
      overflow-y: overlay !important;
      // overscroll-behavior: contain;


      
      @media screen and (max-width: 599px) {
        // background-color: rgba(0, 0, 0, 0.03) !important;
        // border-top: thin solid rgba(0, 0, 0, 0.12);
        min-height: 400px;
      }
    }
    @media screen and (min-width: 600px) {
      position: relative;
      padding-top: 55px;    
      .v-input {
        
        margin-top: -50px;
        margin-bottom: 32px;
        
          
      }
    }
    @media screen and (max-width: 599px) {
      padding-top: 20px;
      .v-input {
          margin-right: 0 !important;
          margin-left: 0 !important;
          padding-left: 16px;
          padding-right: 16px;
        }
    }
    
    .v-data-table-header {
      span {
        font-size: 16px !important;
      }
      @media screen and (min-width: 600px) {
        position: absolute;
        top: 55px;
        width: 100%;
        tr {
          display: flex;
          justify-content: space-around;
          align-items: center;
          th {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
          }
        }
      }
      @media screen and (max-width: 599px) {
        display: none;
      }
    }
    @media screen and (max-width: 599px) {
      .v-data-footer {
        height: 58px;
        display: flex;
        justify-content: flex-end;
        .v-data-footer__icons-before {
          font-size: 16px;
        }
        .v-data-footer__icons-after {
          font-size: 16px;
        }
        .v-data-footer__select {
          display: none;
          }
        .v-data-footer__pagination {
          font-size: 16px;
        }
      }
    }
    @media screen and (min-width: 600px) {
      .v-data-footer {
        height: 58px;
        display: flex;
        justify-content: flex-end;
        .v-data-footer__icons-before {
          display: none;
        }
        .v-data-footer__icons-after {
          display: none;
        }
        .v-data-footer__select {
          display: none;
          }
        .v-data-footer__pagination {
          font-size: 16px;
        }
      }
    }
  
  .v-row-group__header {
    display: none
  }
  .v-data-footer {
    flex-wrap: nowrap;
  }
}
.table-body {

  .table-row-pc {
    height: 77px;

    td {
      .v-card__text {
        font-size: 16px;
        padding-left: 0;
      }
      .v-card__text:first-child {
        padding-right: 0;
      }
    }
    @media screen and (max-width: 599px) {
      display: none;
    }
  }
  .table-row-sp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
    div {
      width: 100%;
      td {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border: 0px !important;
        .v-card__text:first-child {
          font-weight: 700;
          font-size: 16px;
          width: fit-content !important;
          padding: 20px 20px;
        }
        .v-card__text:last-child {
          font-size: 16px;
          width: fit-content !important;
          padding: 20px 20px;
        }
      }
      td:nth-child(2) {
        .v-card__text:first-child {

          padding: 0 20px
        }
        .v-card__text:last-child {

          padding: 0 20px;
        }
      }
      // .td-btn {
      //   display: flex;
      //   justify-content: center;
      //   .v-btn {
      //     margin: 5px;
      //     border-radius: 50%;
      //     width: 40px !important;
      //     min-width: 40px !important;
      //     height: 40px !important;
      //   }
      // }
    }
    
    @media screen and (min-width: 600px) {
      display: none;
    }
  }
}
.add-event-photo-comment {
  .v-textarea {
    .v-input__control {
      .v-input__slot {
        padding-bottom: 10px !important;
      }
    }
  }
}

</style>