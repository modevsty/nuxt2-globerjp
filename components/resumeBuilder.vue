<template>
  <div>
    <Spinner v-if="!pageLoaded && !isMounted" />
    <client-only class="pa-3" v-else>
      <v-card>
        <v-app-bar
          style="margin-top: 0px;transform: translateY(0px);left: 0px;right: 0px;"
          color="#1976d2"
          dark
        >
          <v-toolbar-title>
            glober Resume Builder
          </v-toolbar-title>
        </v-app-bar>
      </v-card>
      <div style="padding-bottom: 3em">
        <v-stepper v-model="e1" light>
          <v-stepper-header>
            <v-stepper-step :editable="e1 > 1" :complete="e1 > 1" step="1"
              >Fundamental Information</v-stepper-step
            >

            <v-divider></v-divider>

            <v-stepper-step :editable="e1 > 2" :complete="e1 > 2" step="2"
              >Education</v-stepper-step
            >

            <v-divider></v-divider>

            <v-stepper-step :editable="e1 > 3" :complete="e1 > 3" step="3"
              >Job</v-stepper-step
            >

            <v-divider></v-divider>

            <v-stepper-step :editable="e1 > 4" :complete="e1 > 4" step="4"
              >Qualification</v-stepper-step
            >

            <v-divider></v-divider>

            <v-stepper-step step="5">Photo</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <section class="section">
                <h2 class="subtitle">Fundamental Information</h2>
                <v-form ref="fundamentalForm" v-model="valid[0]" class="container">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="basic.firstName"
                        :rules="[
                          rules.required,
                          value => customCounter(value, 20)
                        ]"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="basic.lastName"
                        :rules="[
                          rules.required,
                          value => customCounter(value, 20)
                        ]"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="basic.firstNameH"
                        :rules="[
                          rules.required,
                          value => customCounter(value, 12)
                        ]"
                        label="First Name(Furigana)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="basic.lastNameH"
                        :rules="[
                          rules.required,
                          value => customCounter(value, 12)
                        ]"
                        label="Last Name(Furigana)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="col-sm-6">
                      <v-text-field
                        v-model="basic.email"
                        :rules="[
                          rules.required,
                          rules.email,
                          value => customCounter(value, 45)
                        ]"
                        label="Email Address"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="col-sm-6">
                      <birthday-picker :label="'Birthday'" :rules="[rules.required]" v-model="basic.birthday"/>
                    </v-col>
                    <v-col cols="12" class="col-sm-6">
                      <v-text-field
                        v-model="basic.postalCode"
                        :rules="[value => customCounter(value, 15)]"
                        label="Postal Code"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" class="col-sm-6">
                      <v-text-field
                        v-model="basic.address"
                        :rules="[
                          rules.required,
                          value => customCounter(value, 100)
                        ]"
                        label="Address"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" class="col-sm-6">
                    <v-text-field
                      v-model="basic.phoneNumber"
                      :rules="[rules.required, value => customCounter(value, 18)]"
                      label="Phone Number"
                    >
                    </v-text-field>
                  </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                    <p style="text-align:left" class="mb-0">Gender</p>
                    <span>
                      <v-radio-group v-model="basic.gender" mandatory>
                        <v-radio label="Male" value="男"></v-radio>
                        <v-radio label="Female" value="女"></v-radio>
                        <v-radio label="Prefer not to say" value=" "></v-radio>
                      </v-radio-group>
                    </span>
                    </v-col>
                  </v-row>
                </v-form>
              </section>
              <section
                style="left: 0px; right: 0px; bottom: 0px; margin-top:10px;"
                app
              >
                <v-btn
                  block
                  raised
                  elevation="2"
                  @click="
                    () => {
                      setBasic();
                    }
                  "
                  >Save Draft and Proceed</v-btn
                >
              </section>
            </v-stepper-content>

            <v-stepper-content step="2">
              <section class="section">
                <h2 class="subtitle">Education Background</h2>
                <v-form ref="educationForm" v-model="valid[1]" class="container">
                  <span
                    v-for="education in educations"
                    :key="education.id"
                    class="education-cards"
                  >
                    <v-card
                      class="education-card"
                      style="margin-bottom: 40px; position: relative"
                    >
                      <v-icon
                        role="button"
                        class="close-button"
                        @click="removeEducation(education)"
                        >mdi-close</v-icon
                      >
                      <v-card-text>
                        <span>
                          <v-text-field
                            v-model="education.schoolName"
                            :rules="[
                              rules.required,
                              value => customCounter(value, 27)
                            ]"
                            label="Name of HighSchool/College"
                          >
                          </v-text-field>
                        </span>
                        <p>
                          Degree
                        </p>
                        <span>
                          <v-radio-group
                            v-model="education.degree"
                            mandatory
                          >
                            <v-radio
                              label="Highschool Degree"
                              value="highschool degree"
                            ></v-radio>
                            <v-radio label="Bachelor" value="bachelor"></v-radio>
                            <v-radio label="Master" value="master"></v-radio>
                            <v-radio label="PhD" value="PhD"></v-radio>
                            <v-radio
                              label="Other"
                              value="other"
                            ></v-radio>
                          </v-radio-group>
                        </span>
                        <span v-if="education.degree && education.degree !== 'highschool degree'">
                          <v-text-field
                            v-model="education.major"
                            :rules="[
                              rules.required,
                              value => customCounter(value, 27)
                            ]"
                            :label="education.degree === 'other'? 'Degree and Major':'Major'"
                          >
                          </v-text-field>
                        </span>
                        <span>
                          <birthday-picker :type="'month'" :label="'Date of Entry'" :rules="[rules.required]" v-model="education.dateOfEntry"/>
                        </span>
                        <p>
                          Did you graduate from this school/college?
                        </p>
                        <span>
                          <v-radio-group
                            v-model="education.graduated"
                            mandatory
                          >
                            <v-radio label="Yes" value="yes"></v-radio>
                            <v-radio
                              label="No (I dropped out)"
                              value="no"
                              @change="education.dateOfGraduation = ''"
                            ></v-radio>
                            <v-radio
                              label="No (I am currently enrolled)"
                              value="currentlyEnrolled"
                              @change="education.dateOfGraduation = ''"
                            ></v-radio>
                          </v-radio-group>
                        </span>
                        <span v-if="education.graduated && education.graduated !== 'currentlyEnrolled'">
                           <birthday-picker :type="'month'" :label="education.graduated === 'no'? 'Date of Dropout' : 'Date of Graduation'" :rules="[rules.required]" v-model="education.dateOfGraduation"/>
                        </span>
                      </v-card-text>
                    </v-card>
                  </span>
                </v-form>
                <v-btn block @click="addEducation">
                  <v-icon>mdi-plus-circle</v-icon>
                  ADD EDUCATION BACKGROUND
                </v-btn>
              </section>

              <!-- <v-footer fixed style="left: 0px; right: 0px; bottom: 0px;" app>
                <v-btn block @click="e1 = 3">Save Draft and Proceed</v-btn>
              </v-footer> -->

              <section
                style="left: 0px; right: 0px; bottom: 0px; margin-top:10px;"
                app
              >
                <v-btn
                  block
                  @click="
                    () => {
                      setEducation()
                     
                    }
                  "
                  >{{'Save Draft and Proceed'}}</v-btn
                >
              </section>
            </v-stepper-content>
            <!-- Job section -->
            <v-stepper-content step="3">
              <section class="section">
                <h2 class="subtitle">Job Background</h2>
                <v-form ref="jobForm" v-model="valid[2]" class="container">
                  <span v-for="job in jobs" :key="job.id">
                    <v-card style="margin-bottom: 40px; position: relative">
                      <v-icon
                        role="button"
                        class="close-button"
                        @click="removeJob(job)"
                        >mdi-close</v-icon
                      >
                      <v-card-text>
                        <span>
                          <v-text-field
                            v-model="job.companyName"
                            :rules="[
                              rules.required,
                              value => customCounter(value, 25)
                            ]"
                            label="Company Name"
                          >
                          </v-text-field>
                        </span>
                        <span>
                          <v-text-field
                            v-model="job.position"
                            :rules="[
                              rules.required,
                              value => customCounter(value, 25)
                            ]"
                            label="Position"
                          >
                          </v-text-field>
                        </span>
                        <span>
                          <v-textarea
                            v-model="job.description"
                            :rules="[rules.required, rules.descriptionCounter]"
                            label="Description"
                          >
                          </v-textarea>
                        </span>
                        <span>
                          <birthday-picker :type="'month'" :label="'Starting Date'" :rules="[rules.required]" v-model="job.startingDate"/>
                        </span>
                        <p>
                          Are you still working here? (yes/no)
                        </p>
                        <span>
                          <v-radio-group
                            v-model="job.stillWorking"
                            mandatory
                          >
                            <v-radio
                              label="Yes"
                              value="yes"
                              @change="job.finishingDate = ''"
                            ></v-radio>
                            <v-radio label="No" value="no"></v-radio>
                          </v-radio-group>
                        </span>
                        <span v-if="job.stillWorking === 'no'">
                          <birthday-picker :type="'month'" :label="'Finishing Date'" :rules="[rules.required]" v-model="job.finishingDate"/>
                        </span>
                      </v-card-text>
                    </v-card>
                  </span>
                </v-form>
                <v-btn block @click="addJob">
                  <v-icon>mdi-plus-circle</v-icon>
                  ADD JOB BACKGROUND
                </v-btn>
              </section>

              <!-- <v-footer fixed style="left: 0px; right: 0px; bottom: 0px;" app>
                <v-btn block @click="e1 = 3">Save Draft and Proceed</v-btn>
              </v-footer> -->

              <section
                fixed
                style="left: 0px; right: 0px; bottom: 0px; margin-top:10px;"
                app
              >
                <v-btn
                  block
                  @click="
                    () => {
                      setJob()
                    }
                  "
                  >Save Draft and Proceed</v-btn
                >
              </section>
            </v-stepper-content>

            <v-stepper-content step="4">
              <section class="section">
                <h2 class="subtitle">Qualifications</h2>
                <v-form ref="qualificationForm" v-model="valid[3]" class="container">
                  <span
                    v-for="qualification in sortedQualifications"
                    :key="qualification.id"
                  >
                    <v-card style="margin-bottom: 40px; position: relative">
                      <v-icon
                        role="button"
                        class="close-button"
                        @click="removeQualification(qualification)"
                        >mdi-close</v-icon
                      >
                      <v-card-text>
                        <span>
                          <v-text-field
                            v-model="qualification.qualificationName"
                            :rules="[
                              rules.required,
                              value => customCounter(value, 70)
                            ]"
                            label="Qualification Name and Level"
                          >
                          </v-text-field>
                        </span>
                        <span>
                          <birthday-picker :type="'month'" :label="'Date Obtained'" :rules="[]" v-model="qualification.obtainedDate"/>
                        </span>
                      </v-card-text>
                    </v-card>
                  </span>
                </v-form>
                <v-btn block @click="addQualification">
                  <v-icon>mdi-plus-circle</v-icon>
                  ADD QUALIFICATION BACKGROUND
                </v-btn>
              </section>

              <!-- <v-footer fixed style="left: 0px; right: 0px; bottom: 0px;" app>
                <v-btn block @click="e1 = 3">Save Draft and Proceed</v-btn>
              </v-footer> -->

              <section
                fixed
                style="left: 0px; right: 0px; bottom: 0px; margin-top:10px;"
                app
              >
                <v-btn
                  block
                  @click="
                    () => {
                      setQualification()
                    }
                  "
                  >Save Draft and Proceed</v-btn
                >
              </section>
            </v-stepper-content>

            <v-stepper-content step="5">
              <section class="section v-card-container" raised>
                <h2 class="subtitle">Photo</h2>
                <v-form v-model="valid[4]" class="container">
                  <v-alert type="info" color="primary" outlined block>
                    Notice: You cannot save photo as Draft.
                  </v-alert>
                  <v-card-text>
                    <!-- <v-file-input
                      v-model="selectedFile"
                      class="my-4"
                      accept="image/png, image/jpeg"
                      label="File"
                      placeholder="Select a file"
                      :show-size="1024"
                      @change="setupCropper"
                    /> -->

                    <!-- <v-file-input
                      v-model="selectedFile"
                      required
                      class="my-4"
                      accept="image/png, image/jpeg"
                      label="File"
                      placeholder="Select a file"
                      :show-size="1024"
                      @change.prevent="setupCropper"
                    /> -->
                    <v-btn
                      style="border: thin solid rgba(0,0,0,0.5)"
                      elevation="0"
                      @click.prevent="launchImageFile"
                    >
                      {{'Choose File'}}
                    </v-btn>
                    <input
                        ref="imageFile"
                        type="file"
                        style="display:none;"
                        :accept="'image/png, image/jpeg'"
                        @click="removeInputImageFile"
                        @change.prevent="
                          imageMiddleware($event.target.files)
                        "
                      />
                    <v-dialog :persistent="isCropping" v-model="cropDialog" offset-y max-width="600px" max-height="350px">
                      <v-card class="d-flex flex-column justify-center align-center">
                        <v-row class="ma-0" style="width: 100%;">
                          <v-col class="d-flex justify-center pa-0">
                            <client-only>
                              <ResumeImageCropper  @isCropping="isCroppingHandler" :imgSrcIn="imgSrc"  :fileType="fileImageCropper.type" :fileName="fileImageCropper.name" @cropImg="cropImgEventHandler" />
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
                                cropDialog = false;
                                $forceUpdate()
                              }
                            "
                          >
                            cancel</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card-text>

                  <v-row v-if="previewCropped"  style="width: 100%">
                    <v-col
                      class="d-flex justify-start"
                    >
                      <div style="width: 250px; height: 330px;">
                        <img class="image-preview d-flex justify-center" :src="previewCropped" />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </section>

              <section
                fixed
                style="left: 0px; right: 0px; bottom: 0px; margin-top:10px;"
                app
              >
                <v-btn
                  block
                  :disabled="!valid[4]"
                  @click="
                    () => {
                      confirmed();
                    }
                  "
                  >Confirm</v-btn
                >
              </section>
            </v-stepper-content>
            <v-stepper-content step="6">
              <section class="section v-card-container" raised>
                <h2 class="subtitle">Confirm</h2>
                <div>
                  <v-card-text class="pt-0">
                    <p>
                      If you want to correct fields, please click on edit buttons
                      above.
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Name
                      </span>
                      <br />
                      {{ basic.firstName }} {{ basic.lastName }} ({{
                        basic.firstNameH
                      }}
                      {{ basic.lastNameH }})
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Gender
                      </span>
                      <br />
                      {{ basic.gender }}
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Birthday
                      </span>
                      <br />
                      {{ basic.birthday }} ({{ calculateAge(basic.birthday) }}
                      y.o.)
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Address
                      </span>
                      <br />
                      {{ basic.postalCode }}
                      <br />
                      {{ basic.address }}
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Email
                      </span>
                      <br />
                      {{ basic.email }}
                    </p>
                    <p>
                      <span class="font-weight-black">
                        Phone
                      </span>
                      <br />
                      {{ basic.phoneNumber }}
                    </p>
                    <div class="pb-4">
                      <span class="font-weight-black">
                        Career
                      </span>
                      <dl
                        v-for="(career, index) of sortedCareer"
                        :key="index"
                        style="list-style-type: none"
                      >
                        <li
                          v-if="
                            career.type === 'education' &&
                              career.degree === 'highschool degree'
                          "
                        >
                          <dt v-if="career.date" class="font-weight-black">
                            {{ career.date }}
                          </dt>
                          <dd
                            v-if="
                              career.event === 'enter' &&
                                !career.currentlyStudying
                            "
                            class="ml-2"
                          >
                            {{ career.name }} 入学
                          </dd>
                          <dd
                            v-else-if="
                              career.event === 'enter' && career.currentlyStudying
                            "
                          >
                            {{ career.name }} 入学、在学中
                          </dd>
                          <dd
                            v-else-if="
                              career.event === 'exit' &&
                                career.graduated === 'yes'
                            "
                            class="ml-2"
                          >
                            {{ career.name }} 卒業
                          </dd>
                          <dd v-else-if="!career.currentlyStudying" class="ml-2">
                            {{ career.name }} 退学
                          </dd>
                        </li>
                        <li
                          v-if="
                            career.type === 'education' &&
                              career.degree !== 'highschool degree'
                          "
                        >
                          <dt v-if="career.date" class="font-weight-black">
                            {{ career.date }}
                          </dt>
                          <dd
                            v-if="
                              career.event === 'enter' &&
                                !career.currentlyStudying
                            "
                            class="ml-2"
                          >
                            {{ career.name }}, {{ career.degree }}
                            {{ career.major }} 入学
                          </dd>
                          <dd
                            v-if="
                              career.event === 'enter' && career.currentlyStudying
                            "
                            class="ml-2"
                          >
                            {{ career.name }}, {{ career.degree }}
                            {{ career.major }} 入学、在学中
                          </dd>
                          <dd
                            v-else-if="
                              career.event === 'exit' &&
                                career.graduated === 'yes'
                            "
                            class="ml-2"
                          >
                            {{ career.name }} 卒業
                          </dd>
                          <dd v-else-if="!career.currentlyStudying" class="ml-2">
                            {{ career.name }} 退学
                          </dd>
                        </li>
                        <li v-if="career.type === 'job'">
                          <dt v-if="career.date" class="font-weight-black">
                            {{ career.date }}
                          </dt>
                          <dd
                            v-if="
                              career.event === 'enter' && career.currentlyWorking
                            "
                            class="ml-2"
                          >
                            {{ career.name }}, {{ career.position }} 入社、勤務中
                          </dd>
                          <dd
                            v-else-if="
                              career.event === 'enter' && !career.currentlyWorking
                            "
                            class="ml-2"
                          >
                            {{ career.name }}, {{ career.position }} 入社
                          </dd>
                          <dd
                            v-if="
                              career.event === 'exit' && !career.currentlyWorking
                            "
                            class="ml-2"
                          >
                            {{ career.name }} 退社
                          </dd>
                        </li>
                      </dl>
                    </div>
                    <div class="pb-4">
                      <span class="font-weight-black">
                        Qualifications
                      </span>
                      <dl
                        v-for="(qualification, index) of sortedQualifications"
                        :key="index"
                        style="list-style-type: none"
                      >
                        <li>
                          <dt class="font-weight-black">
                            {{ qualification.obtainedDate }}
                          </dt>
                          <dd class="ml-2">
                            {{ qualification.qualificationName }}
                          </dd>
                        </li>
                      </dl>
                    </div>
                    <div v-if="previewCropped">
                      <span class="font-weight-black"> Photo </span>
                      <br />
                      <v-row style="width: 100%">
                        <v-col
                          class="d-flex justify-start"
                        >
                          <div style="width: 250px; height: 330px;">
                            <img class="image-preview d-flex justify-center" :src="previewCropped" />
                          </div>
                        </v-col>
                      </v-row>
                      <!-- <div style="width: 250px;">
                        <img
                          style="width: 100%;height:100%;"
                          :src="previewCropped"
                        />
                      </div> -->
                    </div>
                  </v-card-text>
                  <v-card-text>
                    <h2 style="title">Notices and Disclaimer</h2>
                    <ul>
                      <!-- <li>
                        Once generated resume, we will send you the best job
                        opportunities that matches you. You can opt-out anytime.
                      </li> -->
                      <li>
                        Disclaimer: Resume builder is currently in test mode and therefore, I take full responsibility
                        for the pdf generated by it.
                        <!-- Disclaimer: We are not responsible of any loss or other
                        detriments as a result of the data or printed contents
                        printed in this website. -->
                      </li>
                    </ul>
                    <v-checkbox
                      v-model="agreement"
                      label="Agree to the condition(s) mentioned above"
                    ></v-checkbox>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn v-if="!agreement" block disabled>
                      YOU MUST AGREE WITH CONDITIONS ABOVE.
                    </v-btn>
                    <v-row v-else>
                    <v-col>
                        <v-btn
                          block
                          raised
                          :disabled="loading"
                          color="primary"
                          @click="createPDF"
                        >
                          {{loading? 'Creating Pdf...' : 'CREATE RESUME PDF'}}
                        </v-btn>
                      </v-col>
                    <v-col>
                      <v-row>
                      <v-col cols="12" class="col-sm-6">
                      <v-btn
                      @click="saveData"
                      :disabled="loading"
                      block
                      >
                        SAVE DATA
                      </v-btn>
                      </v-col>
                      <v-col cols="12" class="col-sm-6">
                      <v-btn
                      color="error"
                      @click="eraseData"
                      :disabled="loading"
                      block
                      >
                        ERASE DATA
                      </v-btn>
                      </v-col>
                      </v-row>
                    </v-col>
                    </v-row>
                  </v-card-actions>
                </div>
              </section>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-snackbar v-model="snackbar" light bottom :timeout="timeout">
          <div class="d-flex flex-row flex-wrap justify-center align-center">
            <div class="text-body-1">
            {{ snackbarText }}
            </div>
            <div>
              <v-btn
                color="primary"
                text
                @click="
                  () => {
                    loadDraft();
                    snackbar = false;
                  }
                "
              >
                RESTORE
              </v-btn>
              <v-btn color="error" text @click="snackbar = false">
                CLOSE
              </v-btn>
            </div>
          </div>
        </v-snackbar>
      </div>

    </client-only>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import BirthdayPicker from '@/components/BirthdayPicker.vue'
import Spinner from '@/components/LoadingSpinner.vue'
import Cropper from "cropperjs";
import ResumeImageCropper from '@/components/ResumeImageCropper.vue'
import { ParseSpeeds, PDFDocument, rgb } from "pdf-lib";
// import { ParseSpeeds, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// const existingPdfBytes = fs.readFile('@/fixtures/cv-template.pdf')
const BASIC_STORAGE_KEY = "basicInfo";
const EDUCATION_STORAGE_KEY = "educationInfo";
const JOB_STORAGE_KEY = "jobInfo";
const QUALIFICATION_STORAGE_KEY = "qualificationInfo";
const basicStorage = {
  fetch() {
    // debugger
    // const abc = localStorage.getItem(BASIC_STORAGE_KEY)
    // console.log(abc)
    // debugger
    // localStorage.setItem(BASIC_STORAGE_KEY, JSON.stringify(newBasic))
    // const cba = localStorage.getItem(BASIC_STORAGE_KEY)
    // console.log(cba)
    // debugger
    const basic = JSON.parse(localStorage.getItem(BASIC_STORAGE_KEY));

    // todos.forEach(function(todo, index) {
    //   todo.id = index
    // })
    // basicStorage.uid = todos.length
    return basic;
  },
  save(basic) {
    localStorage.setItem(BASIC_STORAGE_KEY, JSON.stringify(basic));
  }
};
const educationStorage = {
  fetch() {
    return JSON.parse(localStorage.getItem(EDUCATION_STORAGE_KEY));
  },
  save(educations) {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(educations));
  }
};
const jobStorage = {
  fetch() {
    return JSON.parse(localStorage.getItem(JOB_STORAGE_KEY));
  },
  save(jobs) {
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(jobs));
  }
};
const qualificationStorage = {
  fetch() {
    return JSON.parse(localStorage.getItem(QUALIFICATION_STORAGE_KEY));
  },
  save(qualifications) {
    localStorage.setItem(
      QUALIFICATION_STORAGE_KEY,
      JSON.stringify(qualifications)
    );
  }
};
export default {
  layout: "home",
  components: {
    Spinner, BirthdayPicker, ResumeImageCropper
  },
  data() {
    return {
      isMounted: false,
      imgType: null,
      cropDialog: false,
      isCropping: false,
      fileImageCropper: {name: '', type:'', width: 0, height: 0},
      imgSrc: null,
      loading: false,
      pdfBytes: null,
      agreement: false,
      career: [],
      cropper: null,
      objectUrl: null,
      previewCropped: null,
      selectedFile: null,
      obtainedMenu: [],
      startingMenu: [],
      finishingMenu: [],
      entryMenu: [],
      graduationMenu: [],
      snackbarText: "You have draft. Click to restore.",
      timeout: 10000,
      snackbar: false,
      e1: 1,
      bdMenu: false,
      maxDate: new Date().toISOString().substr(0, 10),
      valid: new Array(5).fill(true),
      rules: {
        required: value =>
          (value && value.replace(/\s/g, "").length > 0) ||
          "This field is required",
        counter: value =>
          (value && value.length <= 50) ||
          "This field must be less than 50 characters",
        descriptionCounter: value =>
          (value && value.length <= 600) ||
          "This field must be less than 600 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return !!pattern.test(value) || "This field must be a valid email";
        },
        customCounter: (value, limit) => {
          return (
            (value && (this.isKanji(value)? value.length <= Math.round(limit/2) : value.length <= limit)) ||
            `This field must be less than ${this.isKanji(value)? Math.round(limit/2) : limit} characters`
          );
        },
        hiragana: value => {
          const pattern = /^[ぁ-ん]+$/;
          return !!pattern.test(value) || "This field must be hiragana";
        },
        kanji: value => {
          // const pattern = /^[一-龯 ぁ-ん ァ-ン 0-9 -]+$/
          const pattern = /^[\u3000-\u303F \u3040-\u309F \u30A0-\u30FF \uFF00-\uFFEF \u4E00-\u9FAF \u2605-\u2606 \u2190-\u2195 \u203B 0-9- ]+$/;
          return (
            !!pattern.test(value) || "This field must be japanese character"
          );
        }
      },
      educations: [],
      newEducation: {
        id: "",
        degree: "",
        schoolName: "",
        dateOfEntry: "",
        dateOfGraduation: "",
        graduated: ""
      },
      jobs: [],
      qualifications: [],
      basic: {
        email: "",
        firstName: "",
        lastName: "",
        firstNameH: "",
        lastNameH: "",
        birthday: "",
        postalCode: "",
        address: "",
        phoneNumber: "",
        gender: ""
      },
      pageLoaded: false
    };
  },
  computed: {
    ...mapState({
      account: state => state.account.ACCOUNT,
    }),
    user() {
      return this.$store.state.authUser
    },
    sortedCareer() {
      if (this.career.length !== 0) {
        const career = this.career;
        const sorted = career.sort(this.compareCareer);
        if (sorted.length > 20) {
          sorted.splice(20, sorted.length - 20);
        }
        return sorted;
      }
      return [];
    },
    sortedQualifications() {
      if (this.qualifications.length !== 0) {
        const qualifications = this.qualifications;
        const sorted = qualifications.sort(this.compareQualifications);
        if (sorted.length > 11) {
          sorted.splice(11, sorted.length - 11);
        }
        return sorted;
      }
      return [];
    }
    // minDate() {
    //   const d = new Date()
    //   const year = d.getFullYear()
    //   const month = d.getMonth()
    //   const day = d.getDate()
    //   const date = new Date(year - 100, month, day)
    //   return date.toISOString().substr(0, 10)
    // }
  },
  async mounted() {
    this.mounted = true;
    if (this.user) {
      this.basic.email = this.user.email
      if (this.account) {
        this.basic.firstName = this.account.firstName
        this.basic.lastName = this.account.lastName
      }
      const query = this.$fire.firestore.collection('userResumes').doc(this.user.uid)
      const querySnapShot = await query.get()
      if (querySnapShot.exists) {
        const id = querySnapShot.id
        const snap = querySnapShot.data()
        if (snap.resumes.length) {
          const data = snap.resumes[0]
          this.basic = data.basic;
          this.educations = data.educations || [this.newEducation];
          this.educations.forEach((education, index) => {
            education.id = index;
          });
          this.jobs = data.jobs || [];
          this.jobs.forEach((job, index) => {
            job.id = index;
          });
          this.qualifications = data.qualifications || [];
          this.qualifications.forEach((qualification, index) => {
            qualification.id = index;
          });
          this.pageLoaded = true
          return
        }
      } 
    }
    
    const basic = JSON.parse(localStorage.getItem(BASIC_STORAGE_KEY));
    if (basic) {
      this.snackbar = true;
    } else {
      this.snackbar = false;
    }
    this.pageLoaded = true;
  },
  methods: {
    isKanji(word) {
      const pattern = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
      if (!!pattern.test(word)) {
        return true
      }
      return false
    },
    updatePreview(image) {
      // console.log('image here', image)
      if (!image) {
        this.previewCropped = ''
        this.$forceUpdate()
        return;
      };
      // const canvas = this.cropper.getCroppedCanvas();
      // this.previewCropped = canvas.toDataURL("image/png");
      // console.log('image is', image)
      this.previewCropped = image;
      this.$forceUpdate()
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
      this.cropDialog = false
      this.$forceUpdate()
      this.imageSrc=''
      this.removeInputImageFile()
      const file = this.dataURLtoFile(val.img, val.fileName, val.fileType)
      this.imgType = val.fileName.split('.')[1]
      this.updatePreview(val.img)
      // this.uploadImageFile([file],val.index)
    },
    launchImageFile() {
      const file = 'imageFile';
      this.$refs[file].click();
    },
    removeInputImageFile() {
      const file = 'imageFile';
      this.$refs[file].value = null
    },
    async imageMiddleware(files) {
      if (process.browser) {
        if (!files.length) {
          return;
        }
        const file = files[0];
        if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
          // eslint-disable-next-line no-alert
          alert('Please upload image in either png or jpg format.');
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
          this.cropDialog = true
          this.$forceUpdate();
          reader = null
        }, false) 
      }

    },
    async saveData() {
      this.loading = true
      if (!this.user) {
        alert('You must login first.')
        setTimeout(() => {
          this.loading = false
           this.$router.push({
            path: '/login'
          })
        }, 1000)
        return
      }
      await this.updateFirestore()
      this.loading = false
    },
    async eraseData() {
      this.loading =true
      if (!this.user) {
        alert('You must login first.')
        setTimeout(() => {
          this.loading = false
           this.$router.push({
            path: '/login'
          })
        }, 1000)
        return
      }
      await this.eraseFirestore()
      this.loading = false
    },
    async eraseFirestore() {
      try{
        await this.$nuxt.$fire.firestore.collection("userResumes").doc(this.user.uid).delete().then(()=>{
          alert('Successfully deleted!!')
          this.success = "Successfully deleted!!"
          setTimeout(()=>{
            this.success = null
          },2000)
        })
      } catch(error) {
        alert('Could not delete data.')
        console.log(error)
        this.error = "Could not delete data."
        setTimeout(()=>{
          this.error = null
        },2000)
        this.loading = false
      }
    },
    async updateFirestore() {
      try{
        let currDate = Date.now().toString()
        let info = {
          basic: this.basic,
          educations: this.educations,
          jobs: this.jobs,
          qualifications: this.qualifications,
        }
        let data = {
          resumes: [info],
          updatedAt: currDate,
          createdAt: currDate,
          creatorId: this.user.uid
        }
        await this.$nuxt.$fire.firestore.collection("userResumes").doc(this.user.uid).set(data).then(()=>{
          alert('Successfully updated!!')
          this.success = "Successfully updated!!"
          setTimeout(()=>{
            this.success = null
          },2000)
        })
      } catch(error) {
        alert('Could not save data.')
        console.log(error)
        this.error = "Could not save data."
        setTimeout(()=>{
          this.error = null
        },2000)
        this.loading = false
      }
    },
    customCounter(value, limit) {
      return this.rules.customCounter(value, limit);
    },
    compare(a, b) {
      // if (a.finishingDate) {
      //   return -1;
      // }
      // if (b.finishingDate) {
      //   return 1;
      // }
      if (a.finishingDate < b.finishingDate) {
        return 1;
      }
      if (a.finishingDate > b.finishingDate) {
        return -1;
      }
      return 0;
    },
    capitalizeFirstLetter(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      
    },
    chunk(str, n, removeHyphen) {
      const ret = [];
      let i;
      let len;
      let next_i;
      const str_array = str.split(/\n/);
      // console.log('str_array', str_array)
      str_array.forEach(line => {
        if (line.length !== 0) {
          len = line.length;
          i = 0;
          while (i < len) {
            const l = i + n;
            if (l < len) {
              // next_i = line.lastIndexOf(" ", l);
              next_i = l - 1
              // if (next_i === -1) {
              //   next_i = l - 1;
              // }
              ret.push(line.substr(i, next_i - i + 1) + (!removeHyphen && line[next_i] !== " "? "-": ""));
              
              i = next_i + 1;
            } else {
              ret.push(line.substr(i, l - i + 1));
              i = l - 1;
            }
          }
          // for (i = 0, len = line.length; i < len; i += n) {

          //   if (line[i + n] !== " " || line[i + n + 1] !== " ") {
          //     ret.push(line.substr(i, n) + "-");
          //   } else {
          //     ret.push(line.substr(i, n));
          //   }
          // }
        } else {
          ret.push(line);
        }
      });

      return ret;
    },
    async fetchAsset(asset) {
      const data = await fetch(require(`~/assets/${asset}`))
        .then(res => res.arrayBuffer())
        .then(res => new Uint8Array(res));
      return data;
    },
    async renderInIframe(pdfBytes) {
      const promise = new Promise((resolve, reject) => {
        try {
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "glober-resume";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve()
        } catch (e) {
          reject()
        }
      })
      await promise
      
    },
    async createPDF2(prevPdfBytes) {
      const english = /^[a-zA-Z0-9 .:,?"'()-_\r\n]*$$/;
      const [notosansBytes] = await Promise.all([
        this.fetchAsset("fonts/NotoSansJP-Regular.otf")
      ]);
      const [notosansboldBytes] = await Promise.all([
        this.fetchAsset("fonts/NotoSansJP-Bold.otf")
      ]);
      const [emailBytes] = await Promise.all([
        this.fetchAsset("images/email.png")
      ]);
      // const [locationBytes] = await Promise.all([
      //   this.fetchAsset('images/location.png')
      // ])

      const pdfDoc = await PDFDocument.create();

      const emailImage = await pdfDoc.embedPng(emailBytes);
      // const locationImage = await pdfDoc.embedPng(locationBytes)
      // Get the width/height of the PNG image scaled down to 50% of its original size
      const emailDims = emailImage.scale(0.1);

      pdfDoc.registerFontkit(fontkit);
      // Embed the Times-Roman font
      // const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      // const timesboldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
      // console.log(StandardFonts);
      const notosansFont = await pdfDoc.embedFont(notosansBytes);
      const notosansboldFont = await pdfDoc.embedFont(notosansboldBytes);
      // const cjkFont = await pdfDoc.embedFont(PdfCjkFontFamily.HeiseiMinchoW3)

      // Get the first page of the document
      let page = pdfDoc.addPage();

      // Get the width and height of the first page
      const { height } = page.getSize();
      let h = 70;
      const l = 70;
      page.drawText(this.basic.firstName + " " + this.basic.lastName, {
        x: l,
        y: height - h,
        size: 30,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      h = h + 15;
      page.drawImage(emailImage, {
        x: l,
        y: height - h,
        width: emailDims.width,
        height: emailDims.height
      });
      page.drawText(this.basic.email, {
        x: l + 15,
        y: height - h,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      h = h + 25;
      page.drawText("Experience", {
        x: l,
        y: height - h,
        size: 16,
        font: notosansboldFont,
        color: rgb(0, 0, 0)
      });
      h = h + 8;
      const sortedJobs = this.jobs.sort(this.compare);
      sortedJobs.forEach(job => {
        h = h + 15;
        const jobDateStartingArray = job.startingDate.split("-");
        const jobDateStartingYear = jobDateStartingArray[0];
        const jobDateStartingMonth = jobDateStartingArray[1];
        page.drawText(jobDateStartingYear, {
          x: l,
          y: height - h,
          size: 12,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        page.drawText("/", {
          x: l + 30,
          y: height - h,
          size: 12,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        page.drawText(jobDateStartingMonth, {
          x: l + 40,
          y: height - h,
          size: 12,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        page.drawText(" - ", {
          x: l + 55,
          y: height - h,
          size: 12,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        if (job.finishingDate) {
          const jobDateFinishingArray = job.finishingDate.split("-");
          const jobDateFinishingYear = jobDateFinishingArray[0];
          const jobDateFinishingMonth = jobDateFinishingArray[1];
          page.drawText(jobDateFinishingYear, {
            x: l + 70,
            y: height - h,
            size: 12,
            font: notosansFont,
            color: rgb(0, 0, 0)
          });
          page.drawText("/", {
            x: l + 100,
            y: height - h,
            size: 12,
            font: notosansFont,
            color: rgb(0, 0, 0)
          });
          page.drawText(jobDateFinishingMonth, {
            x: l + 110,
            y: height - h,
            size: 12,
            font: notosansFont,
            color: rgb(0, 0, 0)
          });
        } else {
          page.drawText("present", {
            x: l + 70,
            y: height - h,
            size: 12,
            font: notosansFont,
            color: rgb(0, 0, 0)
          });
        }

        h = h + 15;
        page.drawText(job.position, {
          x: l + 15,
          y: height - h,
          size: 12,
          font: notosansboldFont,
          color: rgb(0, 0, 0)
        });
        h = h + 15;
        page.drawText(job.companyName, {
          x: l + 15,
          y: height - h,
          size: 12,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        // page.drawText(job.position, {
        //   x: 180,
        //   y: height - 90,
        //   size: 12,
        //   font: notosansFont,
        //   color: rgb(0, 0, 0)
        // })
        let descriptionArray = this.chunk(job.description, 72);
        if (!english.test(job.description.slice(0, 10))) {
          descriptionArray = this.chunk(job.description, 33);
        }
        h = h + 15;
        descriptionArray.forEach(description => {
          page.drawText(description, {
            x: 100,
            y: height - h,
            size: 12,
            font: notosansFont,
            color: rgb(0, 0, 0)
          });
          h = h + 15;
          if (height - h <= 70) {
            page = pdfDoc.addPage();
            h = 70;
          }
        });

        // this.career.push({
        //   type: 'job',
        //   name: job.companyName,
        //   position: job.position,
        //   description: job.description,
        //   event: 'enter',
        //   date: job.startingDate
        // })
        // this.career.push({
        //   type: 'job',
        //   name: job.companyName,
        //   position: job.position,
        //   description: job.description,
        //   event: 'exit',
        //   date: job.finishingDate
        // })
      });


      // Serialize the PDFDocument to bytes (a Uint8Array)
      this.pdfBytes = await pdfDoc.save();

      const mergedPdf = await PDFDocument.create();

      const pdfA = await PDFDocument.load(prevPdfBytes);
      const pdfB = await PDFDocument.load(this.pdfBytes);

      const copiedPagesA = await mergedPdf.copyPages(
        pdfA,
        pdfA.getPageIndices()
      );
      copiedPagesA.forEach(page => mergedPdf.addPage(page));

      const copiedPagesB = await mergedPdf.copyPages(
        pdfB,
        pdfB.getPageIndices()
      );
      copiedPagesB.forEach(page => mergedPdf.addPage(page));

      const mergedPdfFile = await mergedPdf.save();
      this.renderInIframe(mergedPdfFile);
      this.loading = false;
    },
    async createPDF() {
      this.loading = true;
      this.$forceUpdate()
      const [notosansBytes] = await Promise.all([
        this.fetchAsset("fonts/NotoSansJP-Regular.otf")
      ]);
      const base64 = await fetch("/pdfs/cv-template.pdf").then(res =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(base64, {
        parseSpeed: ParseSpeeds.Fastest
      });
      pdfDoc.registerFontkit(fontkit);
      // Embed the times font
      // const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const notosansFont = await pdfDoc.embedFont(notosansBytes);
      // const cjkFont = await pdfDoc.embedFont(PdfCjkFontFamily.HeiseiMinchoW3)

      // Get the first page of the document

      const pages = pdfDoc.getPages();
      let firstPage = pages[0];
      let secondPage = pages[1];

      // Get the width and height of the first page
      const { width, height } = firstPage.getSize();

      // draw hiragana name
      firstPage.drawText(`${this.basic.lastNameH}  ${this.basic.firstNameH}`, {
        x: 110,
        y: height - 90,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      // draw name
      firstPage.drawText(`${this.basic.lastName} ${this.basic.firstName}`, {
        x: 90,
        y: height - 130,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      // draw date
      const todayDate = new Date().toISOString().substr(0, 10);
      const todayDateArray = todayDate.split("-");
      const todayYear = todayDateArray[0];
      const todayMonth = todayDateArray[1];
      const todayDay = todayDateArray[2];
      firstPage.drawText(todayYear, {
        x: 263,
        y: height - 67,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(todayMonth, {
        x: 313,
        y: height - 67,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(todayDay, {
        x: 343,
        y: height - 67,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });


      // draw birthday
      const birthdayArray = this.basic.birthday.split("-");
      const birthyear = birthdayArray[0];
      const birthmonth = birthdayArray[1];
      const birthday = birthdayArray[2];
      firstPage.drawText(birthyear, {
        x: 102,
        y: height - 180,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(birthmonth, {
        x: 150,
        y: height - 180,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(birthday, {
        x: 192,
        y: height - 180,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(`${this.calculateAge(this.basic.birthday)}`, {
        x: 266,
        y: height - 180,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      // draw gender
      firstPage.drawText(this.basic.gender, {
        x: 360,
        y: height - 180,
        size: 12,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      //       // Draw a string of dots on the page
      // for (let i = 0; i < width; i += 10) {
      //   for (let j = 0; j < height; j += 10) {
      //     firstPage.drawText('.', {
      //       x: i,
      //       y: j,
      //       size: 12,
      //       font: notosansFont,
      //       color: rgb(0, 0, 0)
      //     })
      //   }
      // }

      if (this.previewCropped && (this.imgType === 'png' || this.imgType === 'jpg' || this.imgType === 'jpeg')) {
        let imageProfile = ''
        if (this.imgType === 'jpg' || this.imgType === 'jpeg') {
          imageProfile = await pdfDoc.embedJpg(this.previewCropped)
        }
        if (this.imgType === 'png') {
          imageProfile = await pdfDoc.embedPng(this.previewCropped)
        }
        const imageProfileDims = imageProfile.scale(1);
        

        firstPage.drawImage(imageProfile, {
          x: 420,
          y: height - 185,
          width: 120,
          height: 120 * imageProfileDims.height/imageProfileDims.width
        });
      }


      // draw postalcode
      const postalcodeArray = [];
      let unformattedPostalcode = "";
      unformattedPostalcode = this.basic.postalCode.replace("-", "");
      unformattedPostalcode = this.basic.postalCode.replace("ー", "");
      postalcodeArray.push(unformattedPostalcode.substr(0, 3));
      postalcodeArray.push(unformattedPostalcode.substr(3));
      firstPage.drawText(postalcodeArray[0], {
        x: 129,
        y: height - 227,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(postalcodeArray[1], {
        x: 165,
        y: height - 227,
        size: 11,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      // draw address
      const chunkSize = this.isKanji(this.basic.address)? 26 : 52
      const addressArray = this.chunk(this.basic.address, chunkSize);
      let h = 250;
      addressArray.forEach(address => {
        firstPage.drawText(address, {
          x: 100,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        h = h + 20;
      });

      // draw Tel
      firstPage.drawText(this.basic.phoneNumber, {
        x: 442,
        y: height - 210,
        size: 10,
        font: notosansFont,
        color: rgb(0, 0, 0)
      });

      // draw Email
      const emailArray = this.chunk(this.basic.email, 25, true);
      h = 250;
      emailArray.forEach(email => {
        firstPage.drawText(email, {
          x: 420,
          y: height - h,
          size: 10,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        h = h + 18;
      });
      h = 424;

      let page = firstPage
      this.sortedCareer.forEach(career => {
        const careerDateArray = career.date.split("-");
        const careerYear = careerDateArray[0];
        const careerMonth = careerDateArray[1];
        page.drawText(careerYear, {
          x: 65,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        page.drawText(careerMonth.replace(/^0+/, ""), {
          x: 119,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        let event = "";
        let mappingDegree = {
          "master" : "修士",
          "bachelor" : "学士",
          "phD" : "博士"
        }
        if (career.type === "education") {
          if (career.event === "enter") {
            // if (career.major === "none") {
            //   event = `${this.capitalizeFirstLetter(career.degree)}, ${
            //     career.name
            //   } 入学`;
            // } else {
              if (!career.degree || career.degree === 'highschool degree') {
                event = `${career.name} 入学`;
              } else if (career.degree === 'other')  {
                event = `${career.major}, ${career.name} 入学`;
              } else  {
                event = `${mappingDegree[career.degree]}、${
                  career.major
                }、${career.name} 入学`; 
              }
             
            // }
            if (career.currentlyStudying) {
              event += "、在学中";
            }
          } else if (career.event === "exit" && career.graduated === "yes") {
            event = `${this.capitalizeFirstLetter(career.name)} 卒業`;
          } else if (!career.currentlyStudying) {
            event = `${this.capitalizeFirstLetter(career.name)} 退学`;
          }
        } else if (career.event === "enter") {
          event = `${this.capitalizeFirstLetter(career.position)}、${
            career.name
          } 入社`;
          if (career.currentlyWorking) {
            event += "、勤務中";
          }
        } else if (career.event === "exit" && !career.currentlyWorking) {
          event = `${this.capitalizeFirstLetter(career.name)} 退社`;
        }
        page.drawText(event, {
          x: 155,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        h = h + 25.5;
        if (height - h <= 50) {
          page = secondPage;
          h = 60;
        }
      });

      h = 237.5;
      this.sortedQualifications.forEach(qualification => {
        const qualificationDateArray = qualification.obtainedDate.split("-");
        const qualificationYear = qualificationDateArray[0];
        const qualificationMonth = qualificationDateArray[1];
        secondPage.drawText(qualificationYear, {
          x: 65,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        secondPage.drawText(qualificationMonth.replace(/^0+/, ""), {
          x: 119,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        secondPage.drawText(qualification.qualificationName, {
          x: 155,
          y: height - h,
          size: 11,
          font: notosansFont,
          color: rgb(0, 0, 0)
        });
        h = h + 25.5;
      });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      this.pdfBytes = await pdfDoc.save();
      await this.renderInIframe(this.pdfBytes);
      this.loading = false;
      this.$forceUpdate();
      // this.renderInIframe(this.pdfBytes);
      // this.createPDF2(this.pdfBytes);
      // if (this.jobs.length !== 0) {
      //   setTimeout(() => {
      //     // 年から選ぶようにする
      //     this.createPDF2();
      //   }, 100);
      // }
    },
    compareQualifications(a, b) {
      if (a.obtainedDate > b.obtainedDate || a.obtainedDate === "") {
        return 1;
      }
      if (a.obtainedDate < b.obtainedDate || b.obtainedDate === "") {
        return -1;
      }
      return 0;
    },
    compareCareer(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    },
    confirmed() {
      // if (!this.selectedFile) {
      //   alert("Invalid Field Present");
      //   return;
      // }

      this.career = [];

      this.educations.forEach(education => {
        this.career.push({
          type: "education",
          name: education.schoolName,
          degree: education.degree,
          major: education.major,
          event: "enter",
          currentlyStudying: !education.dateOfGraduation,
          date: education.dateOfEntry
        });

        if (education.dateOfGraduation) {
          this.career.push({
            type: "education",
            name: education.schoolName,
            degree: education.degree,
            major: education.major,
            event: "exit",
            currentlyStudying: !education.dateOfGraduation,
            graduated: education.graduated,
            date: education.dateOfGraduation
          });
        }
      });

      this.jobs.forEach(job => {
        this.career.push({
          type: "job",
          name: job.companyName,
          position: job.position,
          description: job.description,
          currentlyWorking: !job.finishingDate,
          event: "enter",
          date: job.startingDate
        });
        if (job.finishingDate) {
          this.career.push({
            type: "job",
            name: job.companyName,
            position: job.position,
            description: job.description,
            currentlyWorking: !job.finishingDate,
            event: "exit",
            date: job.finishingDate
          });
        }
      });
      this.e1 = 6;
    },
    calculateAge(birthday) {
      // birthday is a date

      const ageDifMs = Date.now() - Date.parse(birthday);

      const ageDate = new Date(ageDifMs); // miliseconds from epoch

      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
    loadDraft() {
      this.basic = JSON.parse(localStorage.getItem(BASIC_STORAGE_KEY));
      this.educations = JSON.parse(
        localStorage.getItem(EDUCATION_STORAGE_KEY)
      ) || [this.newEducation];
      this.educations.forEach((education, index) => {
        education.id = index;
      });
      this.jobs = JSON.parse(localStorage.getItem(JOB_STORAGE_KEY)) || [];
      this.jobs.forEach((job, index) => {
        job.id = index;
      });
      this.qualifications =
        JSON.parse(localStorage.getItem(QUALIFICATION_STORAGE_KEY)) || [];
      this.qualifications.forEach((qualification, index) => {
        qualification.id = index;
      });
    },
    addQualification() {
      if(this.qualifications.length <= 10) {
          this.qualifications.push({
          id: this.qualifications.length,
          qualificationName: "",
          obtainedDate: ""
        });
      } else {
        alert("Cannot add more than 11 qualifications. Please remove some.");
      }
      
    },
    removeQualification(qualification) {
      const confirmation = confirm("Are you sure?");
      // console.log(confirmation);

      if (!confirmation) return;
      this.qualifications.splice(this.qualifications.indexOf(qualification), 1);

      this.qualifications.forEach((qualification, index) => {
        qualification.id = index;
      });
    },
    setQualification() {
      this.$refs.qualificationForm.validate()
      if (!this.valid[3]) {
        if (process.browser) {
            window.alert('Cannot Save. Some Fields are missing or wrong')
        }
        return
      }
      let check = true;

      this.qualifications.forEach(qualification => {
        if (this.checkIfAny(qualification, "")) {
          check = false;
        }
      });

      if (check) {
        qualificationStorage.save(this.qualifications);
        this.e1 = 5;
      } else {
        alert("Invalid Field Present");
      }
    },
    addJob() {
      if (this.jobs.length + this.educations.length < 10) {
        this.jobs.push({
          id: this.jobs.length,
          companyName: "",
          position: "",
          description: "",
          startingDate: "",
          finishingDate: "",
          stillWorking: ""
        });
      } else {
        alert("Total number of jobs and education entries cannot exceed 10. Please remove some before adding more.")
      }
      
    },
    removeJob(job) {
      const confirmation = confirm("Are you sure?");
      // console.log(confirmation);

      if (!confirmation) return;
      this.jobs.splice(this.jobs.indexOf(job), 1);

      this.jobs.forEach((job, index) => {
        job.id = index;
      });
    },
    setJob() {
      this.$refs.jobForm.validate()
      if (!this.valid[2]) {
        if (process.browser) {
            window.alert('Cannot Save. Some Fields are missing or wrong')
        }
        return
      }
      let check = true;

      this.jobs.forEach(job => {
        // eslint-disable-next-line
        let { finishingDate, ...newJob } = job;
        if (job.stillWorking === "no") {
          newJob = job;
        }
        if (this.checkIfAny(newJob, "")) {
          check = false;
        }
      });

      if (check) {
        jobStorage.save(this.jobs);
        this.e1 = 4;
      } else {
        alert("Invalid Field Present");
      }
    },
    addEducation() {
      if (this.jobs.length + this.educations.length < 10) {
        this.educations.push({
          id: this.educations.length,
          schoolName: "",
          dateOfEntry: "",
          dateOfGraduation: "",
          graduated: "",
          degree: null
        });
      } else {
        alert("Total number of education and jobs entries cannot exceed 10. Please remove some before adding more.")
      }
      
    },
    removeEducation(education) {
      const confirmation = confirm("Are you sure?");
      // console.log(confirmation);

      if (!confirmation) return;
      this.educations.splice(this.educations.indexOf(education), 1);

      this.educations.forEach((education, index) => {
        education.id = index;
      });
    },
    setEducation() {

      this.$refs.educationForm.validate()
      if (!this.valid[1]) {
        if (process.browser) {
          window.alert('Cannot Save. Some Fields are missing or wrong')
        }
        return
      }
      let check = true;

      this.educations.forEach(education => {
        if (education.degree === "highschool degree") {
          education.major = "none";
        }
        // eslint-disable-next-line
        let { dateOfGraduation, ...newEdu } = education;
        if (education.graduated !== "currentlyEnrolled") {
          newEdu = education;
        }

        if (this.checkIfAny(newEdu, "")) {
          check = false;
        }
      });

      if (check) {
        educationStorage.save(this.educations);
        this.e1 = 3;
      } else {
        alert("Invalid Field Present");
      }
    },
    setBasic() {
      this.$refs.fundamentalForm.validate()
      if (!this.valid[0]) {
        if (process.browser) {
            window.alert('Cannot Save. Some Fields are missing or wrong')
        }
        return
      }
      // if (this.checkIfAny(this.basic, "")) {
      //   alert("Invalid Field Present");
      //   return;
      // }
      //
      // const a = basicStorage.fetch()
      // console.log(a)
      // console.log(this.basic)
      // debugger
      basicStorage.save(this.basic);
      this.e1 = 2;
      // const b = basicStorage.fetch()
      // console.log(b)
      // debugger
    },
    checkIfAny(obj, val) {
      return Object.values(obj).some(k => k === val);
    }
  }
};
</script>
<style lang="css">
/* @import 'cropperjs/dist/cropper.css'; */
/* .cropper-container {
  height: auto !important;
}
.cropper-wrap-box {
  display: none;
}
.img-container {
  max-width: 100%;
}

.img-container img {
  width: 100%;
}
.cropper-bg {
  background: transparent;
} */
</style>
<style lang="scss" scoped>
.v-card-container {
  width: 100%;
}
.image-container {
  height: fit-content
}
.image-preview {
  max-height: fit-content;
  border: 2px solid #39f;
  max-width: 100%;
}
.cropper-container {
  width: 100% !important;
}
.cropper-hidden {
  display: none !important;
}
.section {
  display: block;
  .subtitle {
    span {
      .container {
        width: 100%;
        padding: 12px;
        margin-right: auto;
        margin-left: auto;
        max-width: 100%;
        p {
          margin-bottom: 16px;
        }
      }
    }
  }
  .container {
    max-width: 100%;
  }
}
// .education-cards {
//   &:first-child {
//     .close-button {
//       display: none;
//     }
//   }
// }
.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
}
.title {
  padding-bottom: 10px;
  font-size: 1.25rem !important;
  font-weight: 500;
  letter-spacing: 0.0125em !important;
}
</style>
