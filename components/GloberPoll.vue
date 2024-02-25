<template>
    <div class="vue-poll">
        <!-- <Spinner v-if="isLoading" /> -->
        
        <v-card class="vue-poll-inner pa-3 ma-3" >
            <h3  class="qst" v-html="poll.question"></h3>
            <p  style="color:grey; font-size: 14px;" class="qst" v-if="poll.hint" v-html="poll.hint"></p>
            <div class="ans-cnt">
                <div v-for="(a,index) in calcAnswers" :key="index" :class="{ ans: true, [a.custom_class]: (a.custom_class) }">
                    
                    <template v-if="!hasMyAnswer && !isExpired">
                        
                        <div :class="{ 'ans-no-vote noselect': true, active: a.selected }" @click.prevent="handleVote(a)" >
                            <span class="txt" v-html="a.value"></span>
                        </div>      

                    </template>
                    <template v-else>
                        <div class="ans-voted final">
                            <span v-if="a.percent" class="percent" v-text="a.percent"></span>                  
                            <span class="txt" v-html="a.value"></span>                                       
                        </div>
                        <span :class="{ bg: true, selected: mostVotes == a.votes }" :style="{ width: a.percent }"></span>
                    </template>
                    
                </div>
                <v-btn :disabled="isLoading || isExpired"  class="redo-btn" v-if="!isLoading && myAnswer && !isExpired" @click="resetAnswer" text>
                    <v-icon>
                    mdi-arrow-u-left-top-bold
                    </v-icon>
                </v-btn>
            </div>
            <div class="votes" v-if="hasMyAnswer" v-text="totalVotesFormatted + ' votes'"></div>
            
            <template v-if="!hasMyAnswer && isMultiChoice && calcAnswers.filter(a => a.selected).length > 0">
                <div style="width: 100%;" class="d-flex justify-center">
                <v-btn :disabled="isLoading" @click.prevent="handleMultiple" color="primary" style="margin: 0 auto;" dark v-text="submitButtonText"></v-btn>
                </div>
            </template>
        </v-card>
       
    </div>
</template>

<script>
import Spinner from '@/components/LoadingSpinner'
    export default{
        name: 'GloberPoll',
        components: {
            Spinner
        },
        props: {
            isSurveyExpired: {
                type: Boolean,
                required: true
            },
            expireAt: {
                type: String,
                required: true
            },
            poll: {
                type: Object,
                required: true
            },
            pollAnswers: {
                type: Array,
                required: true,
            },
            myOriginalAnswer: {
                type: Object || null,
                default: null
            },
        },
        data(){
            return{
                isLoading: false,
                submitButtonText: 'Submit',
                customId: 0,
                finalResults: false,
                myAnswer: null,
                isExpired: false
            }
        },
        watch: {
            expireAt: {
                handler(val) {
                    if(val) {
                        const diffInMs = parseInt(val) - new Date()
                        this.isExpired = (diffInMs < 0)
                    } else {
                        this.isExpired = false
                    }
                    this.$emit('isExpired',this.isExpired)
                },
                immediate: true
            },
            isSurveyExpired: {
                handler(val) {
                    this.isExpired = val
                },
                immediate: true
            },
            myOriginalAnswer: {
                handler(val) {
                    this.myAnswer = val
                },
                immediate: true,
                deep: true
            }
        },
        computed: { 
            isChoice() {
            return this.poll.type === 'multi-choice' || this.poll.type === 'single-choice'
            },
            isMultiChoice() {
            return this.poll.type === 'multi-choice'
            },
            isSingleChoice() {
            return this.poll.type === 'single-choice'
            },
            user() {
            return this.$store.state.authUser
            },
            answers() {
                const votes = {}
                this.pollAnswers.forEach(e => {
                    e.answers.forEach(f => {
                        if (votes.hasOwnProperty(f)) {
                            votes[f] += 1
                        } else {
                            votes[f] = 1
                        }
                    })
                })
                if (this.myAnswer) {
                    this.myAnswer.answers.forEach(f => {
                        if (votes.hasOwnProperty(f)) {
                            votes[f] += 1
                        } else {
                            votes[f] = 1
                        }
                    })
                }
                const answers = this.poll.options.choices.map(e => ({value: e.value, selected: false, votes: votes[e.value] || 0}))
                return answers
            },
            hasMyAnswer() {
                return this.myAnswer && this.myAnswer.answers && this.myAnswer.answers.length
            },       
            totalVotes(){
                let totalVotes = 0
                this.answers.filter(a=>{
                    if (!isNaN(a.votes) && a.votes > 0)
                        totalVotes += parseInt(a.votes)
                })
                return totalVotes
            },  
            totalVotesFormatted(){
                 return this.totalVotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            mostVotes(){
                let max = 0
                this.answers.filter(a=>{
                    if (!isNaN(a.votes) && a.votes > 0 && a.votes >= max)
                        max = a.votes
                })
                
                return max
            },
            calcAnswers(){
                               
                if (this.totalVotes === 0) {
                    const calcAnswers = this.answers.map(a=>{
                        a.percent = '0%'
                        return a
                    })   
                    return calcAnswers  
                }
                                     
                
                //Calculate percent
                const output =  this.answers.filter(a=>{
                    if (!isNaN(a.votes) && a.votes > 0)
                        a.percent = ( Math.round( (parseInt(a.votes)/this.totalVotes ) * 100) ) + '%'
                    else
                        a.percent =  '0%'
                                        
                    return a
                })
                return output
            },
            totalSelections(){
                const totalSelections = this.calcAnswers.filter(a => a.selected).length
                return totalSelections
            }
        },
        methods: {
            computeIsExpired() {
                if(this.expireAt) {
                    const diffInMs = parseInt(this.expireAt) - new Date()
                    this.isExpired = (diffInMs < 0)
                } else {
                    this.isExpired = false
                }
                this.$emit('isExpired',this.isExpired)
            },
            async addvote(val) {
                this.computeIsExpired()
                if (this.isExpired) {
                    alert("The survey has expired")
                    return
                }
                this.isLoading = true
                const currDate = Date.now().toString()
                const data = {
                    answers: [],
                    pollId: this.poll.id,
                    userId: this.user.uid,
                    createdAt: currDate
                }
                if (this.isMultiChoice) {

                    const values = val.map(e => e.value)
                    data.answers = values
                    await this.$fire.firestore.collection('pollAnswers').add(data).then((doc) => {
                    data['id'] = doc.id
                    this.myAnswer = data
                    this.success = "Successfully updated!!"
                    this.isLoading = false
                    setTimeout(()=>{
                        this.success = null
                    },2000)
                    }).catch(e => {
                    this.isLoading = false
                    this.error = "Error: "+e
                    setTimeout(()=>{
                        this.error = null
                    },2000)
                    })
                }
                if (this.isSingleChoice) {
                    data.answers.push(val.value)

                    await this.$fire.firestore.collection('pollAnswers').add(data).then((doc) => {
                    data['id'] = doc.id
                    this.myAnswer = data
                    this.success = "Successfully updated!!"
                    this.isLoading = false
                    setTimeout(()=>{
                        this.success = null
                    },2000)
                    }).catch(e => {
                    this.error = "Error: "+e
                    this.isLoading = false
                    setTimeout(()=>{
                        this.error = null
                    },2000)
                    })
                }
                this.$forceUpdate()
                
            },
            resetAnswer() {
                this.computeIsExpired()
                if (this.isExpired) {
                    alert("The survey has expired")
                    return
                }
                this.isLoading = true
                this.$fire.firestore.collection('pollAnswers').doc(this.myAnswer.id).delete()
                .then(() => {
                    this.myAnswer = null
                    this.isLoading = false
                    this.$forceUpdate()
                    this.success = "Reset Answer!!"
                    setTimeout(()=>{
                        this.success = null
                    },2000)
                }).catch(e => {
                    console.log(e)
                    this.isLoading = false
                })
                },
            handleMultiple(){
                this.computeIsExpired()
                if (this.isExpired) {
                    alert("The survey has expired")
                    return
                }
                
                let arSelected = []
                this.calcAnswers.filter(a=>{
                    if (a.selected){
                        a.votes++
                        arSelected.push({ value: a.value, votes: a.votes })
                    }
                })
                
                // this.visibleResults = true
                
                // let obj =  { arSelected: arSelected , totalVotes: this.totalVotes }
                
                // if (this.customId)
				// 	obj.customId = this.customId
                
                this.addvote(arSelected)
            },
            async handleVote(a){ //Callback
                this.computeIsExpired()
                if (this.isExpired) {
                    alert("The survey has expired")
                    return
                }
                
                if (this.isMultiChoice){
                    
                    
                    if (a.selected === undefined)
                        console.log("Please add 'selected: false' on the answer object")
                                        
                    a.selected = !a.selected
                    this.$forceUpdate()
                    return
                }
                
                // a.votes++
                // a.selected = true
                // this.visibleResults = true
                                
                // let obj = { value: a.value, votes: a.votes, totalVotes: this.totalVotes }
				
				// if (this.customId)
				// 	obj.customId = this.customId
				
                await this.addvote(a)
            },
        }
    }

</script>

<style>
    .vue-poll{        
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    }
    .vue-poll .vue-poll-inner {
        max-width: 600px;
        width: calc(100% - 20px);
        position: relative;
    }
    
    .vue-poll .vue-poll-inner  .redo-btn {
      color: #8899a6;;
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
    
    .vue-poll .noselect {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    .vue-poll .qst{
        font-weight: normal;
    }
    .vue-poll .ans-cnt{
         margin: 20px 0;   
    }
    .vue-poll .ans-cnt .ans{
        position: relative;
        margin-top: 10px;
    }
    .vue-poll .ans-cnt .ans:first-child{
        margin-top: 0;
    }
    
    .vue-poll .ans-cnt .ans-no-vote{
        text-align: center;
        border: 2px solid #77C7F7;
        box-sizing: border-box;
        border-radius: 5px;
        cursor:pointer; 
        padding: 5px 0; 
        transition: background .2s ease-in-out;
        -webkit-transition: background .2s ease-in-out;
        -moz-transition: background .2s ease-in-out;
    }
    
    .vue-poll .ans-cnt .ans-no-vote .txt{
        color: #77C7F7;
        transition: color .2s ease-in-out;
        -webkit-transition: color .2s ease-in-out;
        -moz-transition: color .2s ease-in-out;
    }
    
    .vue-poll .ans-cnt .ans-no-vote.active{
        background: #77C7F7;
    }
    
    .vue-poll .ans-cnt .ans-no-vote.active .txt{
        color: #fff;
    }
    
    .vue-poll .ans-cnt .ans-voted{
        display: flex;
        padding: 5px 0;
    }
    
    .vue-poll .ans-cnt .ans-voted .percent,
    .vue-poll .ans-cnt .ans-voted .txt{
        position: relative;
        z-index: 1;
    }
    .vue-poll .ans-cnt .ans-voted .percent{
        font-weight: bold;
        min-width: 51px;
        display: inline-block;
        margin:0 10px;
    }
	
	.vue-poll .ans-cnt .ans-voted.selected .txt:after{
		content:'✔';
		margin-left: 10px;
	}
           
    .vue-poll .ans-cnt .ans .bg{
        position: absolute;
        width: 0%;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 0;
        background-color: #E1E8ED;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: all .3s cubic-bezier(0.5,1.2,.5,1.2);
        -webkit-transition: all .3s cubic-bezier(0.5,1.2,.5,1.2);
        -moz-transition: all .3s cubic-bezier(0.5,1.2,.5,1.2);
    }
    
    .vue-poll .ans-cnt .ans .bg.selected{
        background-color: #77C7F7;
    }
    
    .vue-poll .votes{
        font-size: 14px;
        color:#8899A6
    }
    
    .vue-poll .submit{
        display: block;
        text-align: center;
        margin: 0 auto;
        max-width: 80px;
        text-decoration: none;
        background-color: #2196F3;
        color:#fff;
        padding: 10px 25px;
        border-radius: 5px;
        
    }
</style>