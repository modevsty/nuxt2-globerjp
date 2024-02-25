import moment from 'moment'

export default {
  toDate (value) {
    if (!value) {
      return ''
    }
    return moment(value).format('YYYY MMM D HH:mm:ss')
  },
  toOnlyDate (value) {
    if (!value) {
      return ''
    }
    // console.log(value)
    // console.log(moment.unix())
    // console.log(moment(value).format('D MMM YYYY'))
    // console.log(moment(value).format('DD/MM/YYYY'))
    // debugger;
    return moment(value).format('YYYY MMM D')
  },
  toWeekDate (value) {
    if(!value) {
      return ''
    }
    const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const date = new Date(value)
    const day = date.getDay();
    const localDate = date.toLocaleString('en-CA', {year: 'numeric', month: 'numeric', day: 'numeric'})
    const localTime = date.toLocaleString('en-CA', {hour: 'numeric', minute:'2-digit'})
    return localDate + ", " + weekday[day] + ", " + localTime; 
  },
  toWeekDateMin (value) {
    if(!value) {
      return ''
    }
    const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const date = new Date(value)
    const day = date.getDay();
    const localDate = date.toLocaleString('en-CA', {year: 'numeric', month: 'numeric', day: 'numeric'})
    const localTime = date.toLocaleString('en-CA', {hour: 'numeric', minute:'2-digit', hour12: true})
    return localDate + ", " + weekday[day] + ", " + localTime; 
  },
  toWeekDay(value) {
    if(!value) {
      return ''
    }
    const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const date = new Date(value)
    const day = date.getDay()
    const localDate = date.toLocaleString('en-CA', {year: 'numeric', month: 'numeric', day: 'numeric'}).split("-").join(".");
    const localTime = date.toLocaleString('en-CA', {hour: 'numeric', minute:'2-digit'})
    return localDate + ", " + weekday[day] + ", " + localTime; ;
  },
}
