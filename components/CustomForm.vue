<template>
  <v-container class="d-flex flex-column justify-center align-center align-md-stretch" style="max-width: 100%;">
    <v-row style=" max-width: 100%;">

      <v-col cols="12" class="col-md-6 d-flex justify-center align-start">
        <!-- <div v-for="card in cardArray" :key="card.id" style="max-width: 100%;">
          <v-text-field disabled v-model="card.value.name" style="max-width: 100%;"/>
          <v-text-field disabled v-model="card.value.type"  style="max-width: 100%;"/>
          <v-text-field v-model="card.value.label" style="max-width: 100%;"/>
          <v-text-field v-if="card.value.validation" v-model="card.value.validation"  style="max-width: 100%;"/>
          <v-text-field v-if="card.value.validationName" v-model="card.value.validationName"  style="max-width: 100%;"/>
        </div> -->
        <div class="d-flex justify-center" style="width: 100%;max-width: 300px">
          <FormulateForm
            v-if="schema.length > 1"
            class="d-flex justify-center flex-column"
            style="width: 100%;"
            v-model="values"
            :schema="schema"
          />
        </div>
      </v-col>
      <v-col cols="12" class="col-md-6 draggable-form px-0" >
          
          <Draggable style="max-width: 100%; max-height: 400px; overflow: overlay; overscroll-behavior: contain;border: thin solid #f5f5f5;background-color: #f5f5f5" class="d-flex flex-column pa-5 sp-none" v-model="draggableCards">
            <div v-for="(card, i) of cardArray" :key="i" style="position: relative">
              <CustomFormElement v-model="card.value" style="max-width: 100%;"/>
              <v-btn color="error" absolute @click="()=>{deleteCard(i)}" style="display: absolute; right: 5px; bottom: 20px;">Delete</v-btn>
            </div>
          </Draggable>
          <div style="max-width: 100%; max-height: 400px; overflow: overlay; overscroll-behavior: contain;border: thin solid #f5f5f5;background-color: #f5f5f5" class="d-flex flex-column pa-4 pc-none" >
            <div v-for="(card, i) of cardArray" :key="i" style="position: relative">
              <CustomFormElement v-model="card.value" style="max-width: 100%;"/>
              <v-btn color="error" absolute @click="()=>{deleteCard(i)}" style="display: absolute; right: 5px; bottom: 20px;">Delete</v-btn>
            </div>
          </div>
          <div class="d-flex flex-row">
            <v-select :items="items" item-text="text" v-model="selectedItem" item-value="value" />
            <v-btn @click="createCard" class="ma-5 mr-0">Add Row</v-btn>
          </div>
      </v-col>
    </v-row>

    
  </v-container>
</template>

<script>
import Draggable from "vuedraggable";
import CustomFormElement from '@/components/CustomFormElement.vue';
export default {
  components: {
    Draggable,
    CustomFormElement
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      selectedItem: 'text',
      items: [
        {
          value: 'text',
          text: 'Text'
        },
        {
          value: 'textarea',
          text: 'Multi-line text'
        },
        {
          value: 'checkbox',
          text: 'Checkbox'
        },
        {
          value: 'radio',
          text: 'Radio'
        },
        {
          value: 'number',
          text: 'Number'
        },
        {
          value: 'datetime-local',
          text: 'Date-Time'
        },
        {
          value: 'date',
          text: 'Date'
        },
        {
          value: 'time',
          text: 'Time'
        },
        // {
        //   value: 'email',
        //   text: 'Email'
        // },
        {
          value: 'file',
          text: 'File'
        }
      ],
      values: {},
      cardArray: [
        // {value: {
        //   type: 'text',
        //   name: 'Text-1',
        //   label: '<label>',
        //   validation: '',
        //   validationName: ''
        // }}
      ],
      // schema: []
      schema: [
        // {
        //   type: 'text',
        //   name: 'Text-1',
        //   label: '<label>',
        //   validation: '',
        //   validationName: ''
        // }
      ]
    }
  },
  watch: {
    cardArray: {
      handler(val) {
        this.schema = val.map(e => e.value)
        this.schema.push(
          {
            type: 'submit',
            label: 'submit',
            name: 'submit'
          }
        )
      }
    },
    schema(val) {
      this.$emit('input', val)
    }
  },
  computed: {
    draggableCards: {
      get() {
        return this.cardArray;
      },
      set(val) {
        this.cardArray = val;
      }
    }
  },
  mounted() {
    const newArray = []
    this.value.forEach(e=> {
      if (e.type !== 'submit') {
        newArray.push({'value': e})
      }
    })
    this.cardArray = newArray.length? newArray : this.cardArray;
  },
  methods: {

    createCard() {
      this.cardArray.push({
        value: {
          type: this.selectedItem,
          name: this.selectedItem + '_' + Date.now().toString(),
          label: (this.selectedItem + '-' + Date.now().toString().slice(-9).substr(0,7)).replace(/\b\w/g, l => l.toUpperCase()),
          validation: '',
          validationName: ''
        }
      })
    },
    deleteCard(id) {
      this.cardArray.splice(id, 1)
    }
  }
}
</script>
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
.draggable-form {
  top: 0;
  position: sticky;
  max-width:100%; 
  height: fit-content;
  @media screen and (max-width: 959px) {
    position: relative;
  }
}
</style>
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
  }
</style>