<template>
  <v-card v-if="content" class="pa-5 mb-4" style="max-width: 100%">
    <!-- <v-img :src="src"></v-img>
    <v-card-title primary-title>
      <div>{{title}}</div>
    </v-card-title> -->
    <!-- <v-text-field label="Type" disabled v-model="content.type"></v-text-field> -->
    <v-text-field label="Label" v-model="content.label"></v-text-field>
    <v-text-field label="Help Text" v-model="content.help"></v-text-field>  
   <!-- <v-text-field label="Validation" disabled v-model="content.validation"></v-text-field> -->
    <!-- <v-text-field label="Validation Warning Text" disabled v-model="content.validationName"></v-text-field>  -->
     <!-- <v-text-field label="Name" disabled v-model="content.name"></v-text-field> -->
    <v-checkbox
      v-model="checkbox"
      :label="`is required field? ${checkbox.toString()}`"
    ></v-checkbox>
    <v-select label="Select File type" class="mb-4" v-model="fileType" :items="fileItems" item-text="text" item-value="value" v-if="content.type === 'file'"  />
    <v-card outlined class="d-flex flex-column mb-10 pa-5" v-if="content.type === 'checkbox' || content.type === 'radio'">
      <div  v-for="(textfield, i) of textFields" :key="i" class="d-flex flex-row justify-center; align-center">
        <v-text-field v-model="textFields[i]"/>
        <v-btn icon style="display: absolute; margin-left:20px; margin-top: 20px; right: 5px; bottom: 20px;" color="error" @click="()=>{deleteRow(i)}"><v-icon>mdi-delete-empty</v-icon></v-btn>
      </div>
        <v-btn @click="createRow" class="ma-5 mr-0">Add Row</v-btn>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      textFields: [],
      fileType: 'mime:image/jpeg,image/png',
      fileItems: [
        {text: '',
        value: ''},
        {text: 'PDF',
        value: 'mime:application/pdf'},
        {text: 'image',
        value: 'mime:image/jpeg,image/png'},
      ],
      checkbox: false,
      content: {
        type: '',
        name: '',
        label: '',
        help: '',
        validation: '',
        validationName: ''
      },
    }
  },
  props: {
    // title: String,
    // src: String,
    value: {
      type: Object,
      required: true
    },
    // type: String,
    // name: String,
    // label: String,
    // validation: String,
    // validationName: String
  },
  watch: {
    fileType(val) {
      let new_validations = this.purifyValidation('mime')
      if (val) {
        if (new_validations) {
          this.content.validation = new_validations + '|' + val
        } else {
          this.content.validation = val
        }
        // this.content.validationName = 'Uploaded file is not valid type.'
      } else {
        this.content.validation = new_validations
        // this.content.validationName = 'Uploaded file is not valid type.'
      }
      this.getValidationName()
    },
    value (val) {
      this.checkbox = val.validation === 'required'? true: false;
      this.content = val || this.content;
    },
    checkbox(val) {
      let new_validations = this.purifyValidation('required')
      
      if (val) {
        if (new_validations) {
          this.content.validation = new_validations + '|required'
        } else {
          this.content.validation = 'required'
        }
        
        // this.content.validationName = 'This field is required.'
      } else {
        this.content.validation = new_validations;
        // this.content.validationName = 'This field is required.'
      }
      this.getValidationName()
    },
    content: {
      handler(val) {
        this.$emit('input', val);
      }
    },
    textFields(val) {
      this.content.options = val
    },

  },
  methods: {
    getValidationName() {
      let validationName = ''
      if (this.getValidation('required')) {
        validationName = validationName + 'This field'
      }
      if (this.getValidation('mime')) {
        validationName =  'Upload file is not valid type. ' + validationName
      }
      this.content.validationName = validationName
    },
    purifyValidation(dirt) {
      let validations_array = this.content.validation.split('|');
      let new_validations_array = validations_array.filter(e => {
        return (!e.startsWith(dirt))
      })
      return new_validations_array.join('|')
    },
    getValidation(dirt) {
      let validations_array = this.content.validation.split('|');
      let new_validations_array = validations_array.filter(e => {
        return (e.startsWith(dirt))
      })
      return new_validations_array.length? new_validations_array[0] : ''
    },
    createRow() {
      this.textFields.push('<New Option>'+Date.now().toString())
    },
    deleteRow(id) {
      this.textFields.splice(id, 1)
    }
  },
  mounted() {
    this.content = this.value || this.content;
    if (this.value.type === 'checkbox' || this.value.type === 'radio') {
      if (!this.content.options) {
        this.content['options'] = ['<Here enter>']
      }
      this.textFields = this.content.options
    }
    let new_validation = ''
    if (this.value.type === 'file') {
      if (this.getValidation('mime')) {
        new_validation = this.getValidation('mime')
      }
    }
    if (this.getValidation('required')) {
      if (new_validation) {
        new_validation = new_validation + '|required'
      } else {
        new_validation = 'required'
      }
    }
    this.content.validation = new_validation
    this.checkbox = this.getValidation('required')? true: false;
    this.fileType = this.getValidation('mime')
    // debugger;
    
  },
};
</script>
