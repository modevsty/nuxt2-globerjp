<template>
    <v-list two-line subheader>
        <v-subheader class="grey lighten-3">Votes 
            <v-spacer></v-spacer>
            19 hours left
        </v-subheader>

        <!-- Show Vote boxes ready to vote -->
        <v-list-tile v-for="choice in poll.choices"
            v-show="changeInterface" 
            :key="choice.value">
            <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
            <v-list-tile-content>
                <v-list-tile-title>
                    {{ choice.value }}</v-list-tile-title>
                <!-- <v-list-tile-sub-title>45%</v-list-tile-sub-title> -->
            </v-list-tile-content>

            <v-list-tile-action>
                <span>
                    <v-btn icon ripple
                        v-show="changeInterface"
                        @click="countChoice(choice)">
                        <v-icon color="grey lighten-1"  
                            :disabled="!counter">favorite
                        </v-icon>
                    </v-btn>
                </span>
            </v-list-tile-action>
        </v-list-tile > 

            <!-- Show voting results after click --> 
        <div v-if="! changeInterface">
            <v-list-tile v-for="choice in poll.choices"
                :key="choice.value">
                <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{ choice.value }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ choice.count }} vote(s)</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                    <span>
                        <v-btn icon ripple
                            v-show="changeInterface"
                            @click="countChoice(choice)">
                            <v-icon color="grey lighten-1"  
                                :disabled="!counter">favorite
                            </v-icon>
                        </v-btn>
                    </span>
                    <p>{{ (choice.count / voteSum * 100).toFixed(1) }} %</p>
                </v-list-tile-action>
            </v-list-tile > 

            <v-flex text-xs-center>
                <p>{{ voteSum }} responses so far</p>
            </v-flex>
        </div>
    </v-list>
</template>


<script>
export default {
    props: ['id', 'poll'],
    data () {
        return {
            activeClass: false,
            counter: true,
            changeInterface: true,
            totalVotes: 0,
            voted: false
        }
    },
    
    computed: {
        voteSum () {
            if (this.poll) {
                for (var i = 0; i < this.poll.choices.length; i++) {
                    this.totalVotes += parseInt(this.poll.choices[i].count)
                }
                return this.totalVotes
            }
        }
    },

    methods: {
        countChoice (selected) {
            let currentCount = parseInt(selected.count)
            var newCount = currentCount += 1
            let selectedIndex = this.poll.choices.indexOf(selected)
            let payload = {
                id: this.id,
                selected: selectedIndex,
                count: newCount
            }
            this.$store.dispatch('updateCount', payload).then(res => {
                return this.$router.replace({ name: 'Poll', query: { id: this.id }})
            }).then(() => {
                this.changeInterface = false
            })
        }
    }
}
</script>

<style scoped>
.isActive{
    color:red;
}

</style>

