<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          :label="label"
          :rules="rules"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :active-picker.sync="activePicker"
        :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
        min="1950-01-01"
        :type="type"
        @change="save"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
export default {
  props: ['label', 'rules', 'value', 'type'],
  data: () => ({
    activePicker: null,
    date: null,
    menu: false,
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    value: {
      handler(val) {
        this.date = val
      },
      immediate: true,
      deep: true
      
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
      this.$emit('input',date)
    },
  },
}
</script>