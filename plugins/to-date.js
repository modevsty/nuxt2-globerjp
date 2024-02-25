import Vue from 'vue'
import date from '~/services/date'

Vue.filter('toDate', (value) => {
  return date.toDate(value)
})

Vue.filter('toOnlyDate', (value) => {
  return date.toOnlyDate(value)
})

Vue.directive("click-outside", {
  bind(el, binding, vnode) {
    if (el && binding && vnode) {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          if (vnode.context[binding.expression] === 'function') {
            vnode.context[binding.expression](event);
          }
        }
      };
      document.body.addEventListener("click", el.clickOutsideEvent);
    }
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

Vue.mixin({
  methods:{
    toWeekDate(value){
      return date.toWeekDate(value)
    },
    toWeekDateMin(value){
      return date.toWeekDateMin(value)
    },
    toWeekDay(value){
      return date.toWeekDay(value)
    }
  }
})

