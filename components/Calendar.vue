<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          
          flat
        >
          <v-btn
            outlined
            class="sp-none mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
          class=""
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
          class=""
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar" class="">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
            class="calendar-menu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <!-- <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item> -->
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          min-width="340px"
          width="340px"
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="340px"
            width="340px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <!-- <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn> -->
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn> -->
              <!-- <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn> -->
            </v-toolbar>
            <!-- <div v-if="!!selectedEvent.images && selectedEvent.images.length && selectedEvent.images[0].teaserImageUrl" class="pt-0 event-card-inner">
              <v-img
                :src="imgFailed? '/img/image-not-found.png' :selectedEvent.images[0].teaserImageUrl"
                alt="event Post Image"
                class="event-card-img"
                @error="imgFailed=true"
              />
            </div>
            <div v-else class="pt-0 event-card-inner">
              <v-img
                class="event-card-img"
                alt="Image Not Found Image"
                src="/img/image-not-found.png"
              />
            </div> -->
            <v-card-text>
              <p v-if="selectedEvent.description" style="word-break: break-word; font-weight: 700">  {{ `${extractContent(selectedEvent.description,true).substr(0, 80)}...` }}</p>
              <p v-if="selectedEvent.location"> Location: {{ selectedEvent.location }}</p>
              <p v-if="selectedEvent.startDT"> Start Date: {{ selectedEvent.startDT }}</p>
              <p v-if="selectedEvent.endDT"> End Date: {{ selectedEvent.endDT }}</p>
              <p v-if="selectedEvent.duration"> Duration: {{ selectedEvent.duration }}</p>
              <nuxt-link :to="selectedEvent.link"> Go to Event Page! </nuxt-link>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
  import { stripHtml } from "string-strip-html";
  export default {
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      registeredEvents: [],
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['green', 'blue', 'indigo', 'orange', 'pink', 'red','deep-purple', 'cyan',  'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }),
    mounted () {
      this.registeredEvents = this.value
      this.getData()
    },
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    watch: {
      value: {
        handler(val) {
          this.registeredEvents = val
          this.getData()
        },
        deep: true

        
      }
    },
    methods: {
      duration(e) {
        if (!e.eventDateFrom || !e.eventDateTo || !e.eventTimeFrom || !e.eventTimeTo) {
          return ''
        }
        const diffInMs = Math.abs(
          new Date(e.eventDateFrom +"T"+e.eventTimeFrom) -
            new Date(e.eventDateTo +"T"+e.eventTimeTo)
        );

        const minutesDuration = Math.floor(diffInMs / 1000 / 60);
        let days = 0;
        let hours = 0;
        let minutes = 0;
        days = Math.floor(minutesDuration / 1440);
        hours = Math.floor((minutesDuration - days*1440) / 60);
        minutes = minutesDuration % 60;
        
        if (!hours && !minutes && !days) {
            return ""
        }
        return (
            (days ? ( days == 1? `1 day `: `${days} days `) : "") +
            (hours ? ( hours == 1? `1 hour `: `${hours} hours `) : "") +
            (minutes ? ( minutes == 1? `1 minute`: `${minutes} minutes`) : "")
          );
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      getData() {
        if(!this.registeredEvents.length) {
          this.events = []
          return
        };
        let registeredEvents = []
        this.registeredEvents.forEach((e,i)=> {
          const startDate = new Date(Date.parse(e.eventDateFrom+"T"+e.eventTimeFrom))
          const endDate = new Date(Date.parse(e.eventDateTo+"T"+e.eventTimeTo))
          registeredEvents.push({
            name: e.title,
            start: startDate,
            end: endDate,
            color: this.colors[(e.relevanceValue - 1) % this.colors.length],
            timed: startDate.toDateString() == endDate.toDateString()? true: false,
            location: e.isOnline? "Online": (e.location? e.location: ''),
            startDT: e.startDT,
            endDT: e.endDT,
            link: `/event/${e.id}` ,
            description: e.description,
            images: e.images,
            duration: this.duration(e)
          })
        })
        this.events = registeredEvents
      },
      extractContent(s, space) {
        return stripHtml(s).result;
      },
      updateRange ({ start, end }) {
        // const events = []
        // console.log("range", start, end)
        // console.log(this.registeredEvents)
        
        // const min = new Date(`${start.date}T00:00:00`)
        // const max = new Date(`${end.date}T23:59:59`)
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = this.rnd(days, days + 20)
        // let first = ''
        // for (let i = 0; i < eventCount; i++) {
        //   const timed = true
        //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        //   first = new Date(firstTimestamp - (firstTimestamp % 900000))

        //   const secondTimestamp = this.rnd(2, !timed ? 288 : 8) * 900000
        //   const second = new Date(first.getTime() + secondTimestamp)

        //   events.push({
        //     name: this.names[this.rnd(0, this.names.length - 1)],
        //     start: first,
        //     end: second,
        //     color: this.colors[this.rnd(0, this.colors.length - 1)],
        //     timed,
        //   })
        // }
        // this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>
<style lang="scss">
.v-menu__content {
  @media screen and (max-width: 599px) {
    left: 0 !important;
    right: 0;
    margin: auto;
    min-width: min(calc(100% - 20px), 350px) !important;
    width: min(calc(100% - 20px), 350px) !important;
    .v-card {
      width: 100% !important;
      min-width: 100% !important;
    }
  }

}
.sp-none {
  @media screen and (max-width: 599px) {
    display: none;
  }
}
</style>
<style lang="scss" scoped>

.event-card {
        border-radius: 5px;
        .event-card-inner {
          height: 190px;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: hidden;
          @media screen and (max-width: 959px) {
            height: 56vw;
          }
          @media screen and (max-width: 599px) {
            height: 75vw;
          }
          .event-card-img {
            width: auto;
            height: 290px;
            @media screen and (max-width: 959px) {
              height: 56vw;
            }
            @media screen and (max-width: 599px) {
              height: 75vw;
            }
            object-fit: cover;
            border-radius: 5px 5px 0 0;
          }
        }
      }
</style>
