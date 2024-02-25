<template>

  <div v-if="pageLoaded && showChat" class="chat-container" :class="{ 'window-mobile': isDevice }">
    <client-only>
				<div id="picker-container" style="pointer-events: none; position: absolute; z-index: 12; width: 100%; top: 60px; height: calc(100% - 60px);"
				:style=" !this.isDevice && this.roomsListOpened? {
							width: 'calc(100% - 300px)',
							left: '300px'
						} : {}">
					<div v-if="emojiOpened" style="width: 100%; height: 100%; position: relative"
					>
						<div
							style="pointer-events: auto"
							class="vac-emoji-picker vac-picker-reaction"
							
							:style="!isDevice ? {
									height: `${emojiPickerHeight}px`,
									top: `${emojiPickerTop}px`,
									right: `${emojiPickerRight}`,
									left: `${emojiPickerLeft}`,
									display: 'initial',
								}: {
									height: '400px',
									top: '0',
									right: '0',
									left: '0',
									bottom: '0',
									display: 'initial',
									margin: 'auto'
								}"
						>
									<PickerFast
									v-click-outside="onClickOutside"
									style="z-index: 99999"
									ref="chat"
									:data="emojiIndex"
									v-if="emojiOpened"
									class="emoji-picker"
									title="Pick your emoji..."
									emoji="point_up"
									@select="e=>{addEmojiNow(e)}"
								/>
							<!-- <emoji-picker v-if="emojiOpened" ref="emojiPicker" /> -->
						</div>
					</div>
			</div>
			<div v-if="isTouchDisabled" style="position: absolute; z-index: 12; width: 100%; top: 60px; height:100%;"></div>
      <vue-chat
				style="position: relative"
      :height="screenHeight"
      :show-emojis="!isDevice"
      :show-reaction-emojis="true"
      :username-options="{minUsers: 2, currentUser: false}"
			:theme="theme"
			:styles="styles"
			:current-user-id="currentUserId"
			:room-id="roomId"
			:rooms="loadedRooms"
			:loading-rooms="loadingRooms"
			:messages="messages"
			:messages-loaded="messagesLoaded"
			:user-tags-enabled="false"
			:rooms-loaded="roomsLoaded"
			:room-message="roomMessage"
			:templates-text="templatesText"
      :show-add-room="false"
      :accepted-files="'image/png, image/jpeg, image/gif, application/pdf'"
      :message-actions="messageActions"
			:room-info-enabled="true"
			:scroll-distance="60"
			@room-info="openEventPage"
      @fetch-more-rooms="fetchMoreRooms"
			@fetch-messages="fetchMessages"
			@send-message="sendMessage"
			@edit-message="editMessage"
			@delete-message="deleteMessage"
			@open-file="openFile"
			@open-user-tag="openUserTag"
			@send-message-reaction="sendMessageReaction"
			@typing-message="typingMessage"
			@toggle-rooms-list="e => {roomsListOpened = e.opened; $emit('show-demo-options', e.opened)}"
    >
			
			<template v-slot:emoji-picker="{ addEmoji }">
				<div class="vac-emoji-wrapper">
					<div
						class="vac-svg-button vac-emoji-reaction"
						@click="e => {openEmoji(e, addEmoji)}"
					>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								version="1.1"
								width="24"
								height="24"
								:viewBox="`0 0 24 24`"
							>
								<path id="vac-icon-emoji" :d="'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'" />
							</svg>
							
					</div>
				</div>
		</template>
			<!-- <template #emoji-picker-reaction-icon>
								<v-icon>mdi-account</v-icon>
						</template> -->
    	<!--  <template v-slot:emoji-picker="{ emojiOpened, addEmoji }">
				<PickerFast
					v-show="emojiOpened"
					:data="emojiIndex"
					style="position: absolute; top: -425px; flex: 1"
					title="Pick your emoji..."
					emoji="point_down"
					@select="addEmoji"
				>
				</PickerFast>
				<button @click.stop="addEmoji({ unicode: '😁' })">
					{{ emojiOpened }}
				</button>
			</template> -->
      </vue-chat>
  </client-only>
  </div>
</template>
<script>
import { parseTimestamp, isSameDay } from '@/utils/dates'
import data from "emoji-mart-vue-fast/data/twitter.json";
// import ChatWindow, { Rooms } from 'vue-advanced-chat'
// import ChatWindow from 'vue-advanced-chat'
// import 'vue-advanced-chat/dist/vue-advanced-chat.css'
// import ChatWindow from './../../dist/vue-advanced-chat.umd.min.js'
import { Picker as PickerFast, EmojiIndex } from "emoji-mart-vue-fast";

export default {
	components: {
		PickerFast
	},
	props: {
    currentUserId: {
      type: String,
      default: ''
    },
    isAdmin: {
      type: Boolean || String,
      default: false
    },
    screenHeight: {
      type: String,
      required: true
    },
		showChat: {
			type: Boolean,
			required: true
		},
		// roomsListOpened: {
		// 	type: Boolean,
		// 	required: true
		// },
    isDevice: { type: Boolean, required: true }
	},

	emits: ['show-demo-options'],

	data() {
		return {
			isTouchDisabled: false,
			addEmojiLocal: null,
			positionRight: true,
			positionTop: true,
			currMessage: {},
			emojiPickerHeight: 300,
			emojiPickerTop: 0,
			emojiPickerRight: '',
			emojiPickerLeft: '',
			emojiOpened: false,
			emojiIndex: new EmojiIndex(data),
			roomsListOpened: true,
      remainingUsersIdNameList: [],
      pageLoaded: false,
      theme: 'light',
      usersRef: null,
      roomsRef: null,
      messagesRef: null,
      filesRef: null,
      dbTimestamp: null,
      deleteDbField: null,
			roomsPerPage: 15,
			rooms: [],
			roomId: '',
			startRooms: null,
			endRooms: null,
			roomsLoaded: false,
			loadingRooms: true,
			allUsers: [],
      allUsersDictionary: {},
      allUsersIdNameList: [],
			loadingLastMessageByRoom: 0,
			roomsLoadedCount: false,
			selectedRoom: null,
			messagesPerPage: 20,
			messages: [],
			messagesLoaded: false,
			roomMessage: '',
			startMessages: null,
			endMessages: null,
			roomsListeners: [],
			listeners: [],
			typingMessageCache: '',
			disableForm: false,
			addNewRoom: null,
      addRoomUserIdList: [],
			inviteRoomId: null,
			invitedUserIdList: [],
			removeRoomId: null,
			removeUserId: '',
			removeUsers: [],
      messageActions:[
        {
          name: 'replyMessage',
          title: 'Reply'
        },
        {
          name: 'editMessage',
          title: 'Edit Message',
          onlyMe: true
        },
        {
          name: 'deleteMessage',
          title: 'Delete Message',
          onlyMe: !this.isAdmin
        },
      ],
			styles: { 
        message: {
			background: '#fff',
			backgroundMe: '#cce7f2',
			color: '#0a0a0a',
			colorStarted: '#9ca6af',
			backgroundDeleted: '#dadfe2',
			backgroundSelected: '#c2dcf2',
			colorDeleted: '#757e85',
			colorUsername: '#9ca6af',
			colorTimestamp: '#828c94',
			backgroundDate: '#e5effa',
			colorDate: '#505a62',
			backgroundSystem: '#e5effa',
			colorSystem: '#505a62',
			backgroundMedia: 'rgba(0, 0, 0, 0.15)',
			backgroundReply: 'rgba(0, 0, 0, 0.08)',
			colorReplyUsername: '#0a0a0a',
			colorReply: '#6e6e6e',
			colorTag: '#0d579c',
			backgroundImage: '#ddd',
			colorNewMessages: '#1976d2',
			backgroundScrollCounter: '#0696c7',
			colorScrollCounter: '#fff',
			backgroundReaction: '#eee',
			borderStyleReaction: '1px solid #eee',
			backgroundReactionHover: '#fff',
			borderStyleReactionHover: '1px solid #ddd',
			colorReactionCounter: '#0a0a0a',
			backgroundReactionMe: '#cfecf5',
			borderStyleReactionMe: '1px solid #3b98b8',
			backgroundReactionHoverMe: '#cfecf5',
			borderStyleReactionHoverMe: '1px solid #3b98b8',
			colorReactionCounterMe: '#0b59b3',
			backgroundAudioRecord: '#eb4034',
			backgroundAudioLine: 'rgba(0, 0, 0, 0.15)',
			backgroundAudioProgress: '#455247',
			backgroundAudioProgressSelector: '#455247',
			colorFileExtension: '#757e85'
		},

        // general: {
        //   color: 'blue'
        // },
        container: { 
          borderRadius: '5px' 
        } 
      
      },
			templatesText: [
				{
					tag: 'hello',
					text: 'Hi there, nice you meet you.'
				},
				{
					tag: 'thanks',
					text: 'Thank you so much.'
				}
			]
			// ,dbRequestCount: 0
		}
	},

	computed: {
    user() {
      return this.$store.state.authUser
    },
		loadedRooms() {
			return this.rooms.slice(0, this.roomsLoadedCount)
		},
	},
	// watch: {
  //   async $route(to, from) {
  //     if (to.name === 'chat') {
	// 			await this.fetchRooms()
	// 		}
	// 	}
	// },
	// watch: {
	// 	clickedElem: {
	// 		handler(val) {
	// 			console.log(val)
	// 			debugger
	// 		},
	// 		deep: true,
	// 		immediate: true
	// 	}
	// },
	async mounted() {
    const db = this.$fire.firestore
    const storageRef = this.$fire.storage.ref()
    this.usersRef = db.collection('chatUsers')
    this.roomsRef = db.collection('chatRooms')
    this.messagesRef = roomId => this.roomsRef.doc(roomId).collection('chatMessages')
    this.filesRef = storageRef.child('chatFiles')

    this.dbTimestamp = this.$fireModule.firestore.FieldValue.serverTimestamp()
    this.deleteDbField = this.$fireModule.firestore.FieldValue.delete()
		await this.fetchRooms()
    this.pageLoaded = true
    
		// this.updateUserOnlineStatus()
	},

	methods: {
		getMobileOperatingSystem() {
				var userAgent = navigator.userAgent || navigator.vendor || window.opera;

				// Windows Phone must come first because its UA also contains "Android"
				if (/windows phone/i.test(userAgent)) {
						return "Windows Phone";
				}

				if (/android/i.test(userAgent)) {
						return "Android";
				}

				// iOS detection from: http://stackoverflow.com/a/9039885/177710
				if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
						return "ios";
				}

				return "unknown";
		},
		openEventPage(val) {
			if (val.eventId) {
				this.$router.push({
                path: `/event/${val.eventId}`
              })
			}
		},
		async sendMessageReaction({ reaction, remove, messageId, roomId }) {
			firestoreService.updateMessageReactions(
				roomId,
				messageId,
				this.currentUserId,
				reaction.unicode,
				remove ? 'remove' : 'add'
			)
		},

		openEmoji(ev, addEmoji) {
			this.addEmojiLocal = addEmoji
			this.emojiOpened = !this.emojiOpened
			this.$forceUpdate()
			this.setEmojiPickerPosition(
				ev.clientX,
				ev.clientY,
				ev.view.innerWidth,
				ev.view.innerHeight
			)
		},
		setEmojiPickerPosition(clientX, clientY, innerWidth, innerHeight) {
			if(clientX <= innerWidth * 0.66) {
				this.positionRight = false
			} else {
				this.positionRight = true
			}
			if(clientY <= innerHeight/2) {
				this.positionTop = true
			} else {
				this.positionTop = false
			}
			const mobileSize = innerWidth < 500
			const roomFooterRef = document.getElementById('room-footer')
			const pickerContainerRef = document.getElementById('picker-container')

			if (!roomFooterRef) {
				if (mobileSize) this.emojiPickerRight = '-50px'
				return
			}
			if (!mobileSize) {
				const roomFooterTop = roomFooterRef.getBoundingClientRect().top
				const pickerContainerLeft = pickerContainerRef.getBoundingClientRect().left
				const pickerContainerRight = pickerContainerRef.getBoundingClientRect().right
				// const pickerTopPosition =
				// roomFooterTop - clientY > this.emojiPickerHeight - 50
				if (this.positionTop) this.emojiPickerTop = clientY - 110
				else this.emojiPickerTop = clientY - this.emojiPickerHeight - 130

				this.emojiPickerRight = this.positionTop ? (this.positionRight ? `${pickerContainerRight - clientX}px` : "") : (this.positionRight ? `${pickerContainerRight - clientX}px` : "");
				this.emojiPickerLeft = this.positionTop ? (this.positionRight ? "" : `${clientX - pickerContainerLeft}px`) : (this.positionRight ? "" : `${clientX - pickerContainerLeft}px`);

				// console.log('pickerright',this.emojiPickerRight)
			}
		},
		onClickOutside() {
			if (this.emojiOpened) {
				this.emojiOpened = false
			}
		},
 		addEmojiNow(val) {
			this.emojiOpened = false
			if (this.addEmojiLocal) {
				this.addEmojiLocal({unicode: val.native})
			}
		},
		resetRooms() {
			this.loadingRooms = true
			this.loadingLastMessageByRoom = 0
			this.roomsLoadedCount = 0
			this.rooms = []
			this.roomsLoaded = true
			this.startRooms = null
			this.endRooms = null
			this.roomsListeners.forEach(listener => listener())
			this.roomsListeners = []
			this.resetMessages()
		},

		resetMessages() {
			this.messages = []
			this.messagesLoaded = false
			this.startMessages = null
			this.endMessages = null
			this.listeners.forEach(listener => listener())
			this.listeners = []
		},

		async fetchRooms() {
			this.resetRooms()
			await this.fetchMoreRooms()
		},

		async fetchMoreRooms() {
			if (this.endRooms && !this.startRooms) return (this.roomsLoaded = true)

			let query = this.roomsRef
				.where('users', 'array-contains', this.currentUserId)
				.orderBy('lastUpdated', 'desc')
				.limit(this.roomsPerPage)

			if (this.startRooms) query = query.startAfter(this.startRooms)

			const rooms = await query.get()
			// this.incrementDbCounter('Fetch Rooms', rooms.size)

			this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage

			if (this.startRooms) this.endRooms = this.startRooms
			this.startRooms = rooms.docs[rooms.docs.length - 1]

			const roomUserIds = []
			rooms.forEach(room => {
				room.data().users.forEach(userId => {
					const foundUser = this.allUsers.find(user => user?._id === userId)
					if (!foundUser && roomUserIds.indexOf(userId) === -1) {
						roomUserIds.push(userId)
					}
				})
			})

			// this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
			const rawUsers = []
			roomUserIds.forEach(userId => {
				const promise = this.usersRef
					.doc(userId)
					.get()
					.then(user => user.data())

				rawUsers.push(promise)
			})

			this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))]

			const roomList = {}
			rooms.forEach(room => {
				roomList[room.id] = { ...room.data(), users: [] }

				room.data().users.forEach(userId => {
					const foundUser = this.allUsers.find(user => user?._id === userId)
					if (foundUser) roomList[room.id].users.push(foundUser)
				})
			})

			const formattedRooms = []

			Object.keys(roomList).forEach(key => {
				const room = roomList[key]

				const roomContacts = room.users.filter(
					user => user._id !== this.currentUserId
				)

				room.roomName = room.roomName || roomContacts.map(user => user.username).join(', ') || 'Myself'
					// roomContacts.map(user => user.username).join(', ') || 'Myself'

				const roomAvatar =
					room.roomAvatarUrl
						? room.roomAvatarUrl
						: require('@/assets/images/default_profile.png')

				formattedRooms.push({
					...room,
					roomId: key,
					avatar: roomAvatar,
					index: room.lastUpdated.seconds,
					lastMessage: {
						content: 'Room created',
						timestamp: this.formatTimestamp(
							new Date(room.lastUpdated.seconds),
							room.lastUpdated
						)
					}
				})
			})

			this.rooms = this.rooms.concat(formattedRooms)
			formattedRooms.map(room => this.listenLastMessage(room))

			if (!this.rooms.length) {
				this.loadingRooms = false
				this.roomsLoadedCount = 0
			}

			// this.listenUsersOnlineStatus(formattedRooms)
			this.listenRooms(query)
			// setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
		},

		listenLastMessage(room) {
			const listener = this.messagesRef(room.roomId)
				.orderBy('timestamp', 'desc')
				.limit(1)
				.onSnapshot(messages => {
					// this.incrementDbCounter('Listen Last Room Message', messages.size)
					messages.forEach(message => {
						const lastMessage = this.formatLastMessage(message.data())
						const roomIndex = this.rooms.findIndex(
							r => room.roomId === r.roomId
						)
						this.rooms[roomIndex].lastMessage = lastMessage
						this.rooms = [...this.rooms]
					})
					if (this.loadingLastMessageByRoom < this.rooms.length) {
						this.loadingLastMessageByRoom++

						if (this.loadingLastMessageByRoom === this.rooms.length) {
							this.loadingRooms = false
							this.roomsLoadedCount = this.rooms.length
						}
					}
				})

			this.roomsListeners.push(listener)
		},

		formatLastMessage(message) {
			if (!message.timestamp) return

			let content = message.content
			if (message.files?.length) {
				const file = message.files[0]
				content = `${file.name}.${file.extension || file.type}`
			}

			return {
				...message,
				...{
					content,
					timestamp: this.formatTimestamp(
						new Date(message.timestamp.seconds * 1000),
						message.timestamp
					),
					distributed: true,
					seen: message.sender_id === this.currentUserId ? message.seen : null,
					new:
						message.sender_id !== this.currentUserId &&
						(!message.seen || !message.seen[this.currentUserId])
				}
			}
		},

		formatTimestamp(date, timestamp) {
			const timestampFormat = isSameDay(date, new Date()) ? 'HH:mm' : 'DD/MM/YY'
			const result = parseTimestamp(timestamp, timestampFormat)
			return timestampFormat === 'HH:mm' ? `Today, ${result}` : result
		},
		async fetchM({ room, options = {} }) {

				if (this.endMessages && !this.startMessages) {
					return (this.messagesLoaded = true)
				}

				let ref = this.messagesRef(room.roomId)

				let query = ref.orderBy('timestamp', 'desc').limit(this.messagesPerPage)

				if (this.startMessages) query = query.startAfter(this.startMessages)

				this.selectedRoom = room.roomId

				await query.get().then(messages => {
					// this.incrementDbCounter('Fetch Room Messages', messages.size)
					if (this.selectedRoom !== room.roomId) return

					if (messages.empty || messages.docs.length < this.messagesPerPage) {
						setTimeout(() => (this.messagesLoaded = true), 0)
					}

					if (this.startMessages) this.endMessages = this.startMessages
					this.startMessages = messages.docs[messages.docs.length - 1]

					let listenerQuery = ref.orderBy('timestamp')

					if (this.startMessages) {
						listenerQuery = listenerQuery.startAt(this.startMessages)
					}
					if (this.endMessages) {
						listenerQuery = listenerQuery.endAt(this.endMessages)
					}

					if (options.reset) this.messages = []

					const newMessages = []

					messages.forEach(message => {
						const formattedMessage = this.formatMessage(room, message)
						newMessages.push(formattedMessage)
					})
					// const oldMessages = this.messages.slice().reverse()
					// const concatedMessages = oldMessages.concat(newMessages)

					this.messages = [...newMessages.reverse(),...this.messages]
					// this.listeners.forEach(listener => listener())
					// this.listeners = []
					const listener = listenerQuery.onSnapshot(snapshots => {
							// this.incrementDbCounter('Listen Room Messages', snapshots.size)
							this.listenMessages(snapshots, room)
						})
					this.listeners.push(listener)
					this.$nextTick(()=>{
						this.isTouchDisabled = false
					})
					// setTimeout(()=>{
					// 		this.isTouchDisabled = false
					// 	}, 200)
				})
		},

		async fetchMessages(val) {
			this.$emit('show-demo-options', false)
			if (val?.options?.reset) {
					this.resetMessages()
					this.roomId = val.room.roomId
				}
			if (!this.messages.length) {
				await this.fetchM(val)
			} else {
				if (this.getMobileOperatingSystem() === "ios" || !this.isDevice) {
					this.isTouchDisabled = true
					this.$forceUpdate()
				}
				setTimeout(async ()=> {
					await this.fetchM(val)
				},700)
			}
		},

		listenMessages(messages, room) {
			messages.forEach(message => {
				const formattedMessage = this.formatMessage(room, message)
				const messageIndex = this.messages.findIndex(m => m._id === message.id)

				if (messageIndex === -1) {
					this.messages = this.messages.concat([formattedMessage])
				} else {
					this.messages[messageIndex] = formattedMessage
					this.messages = [...this.messages]
				}

				this.markMessagesSeen(room, message)
			})
		},

		markMessagesSeen(room, message) {
			if (
				message.data().sender_id !== this.currentUserId &&
				(!message.data().seen || !message.data().seen[this.currentUserId])
			) {
				this.messagesRef(room.roomId)
					.doc(message.id)
					.update({
						[`seen.${this.currentUserId}`]: new Date()
					})
			}
		},

		formatMessage(room, message) {
			const senderUser = room.users.find(
				user => message.data().sender_id === user._id
			)

			const { timestamp } = message.data()

			const formattedMessage = {
				...message.data(),
				...{
					senderId: message.data().sender_id,
					_id: message.id,
					seconds: timestamp.seconds,
					timestamp: parseTimestamp(timestamp, 'HH:mm'),
					date: parseTimestamp(timestamp, 'DD MMMM YYYY'),
					username: senderUser ? senderUser.username : null,
					// avatar: senderUser ? senderUser.avatar : null,
					distributed: true
				}
			}

			if (message.data().replyMessage) {
				formattedMessage.replyMessage = {
					...message.data().replyMessage,
					...{
						senderId: message.data().replyMessage.sender_id
					}
				}
			}

			return formattedMessage
		},

		async sendMessage({ content, roomId, files, replyMessage }) {
			const message = {
				sender_id: this.currentUserId,
				content,
				timestamp: new Date()
			}

			if (files) {
				message.files = this.formattedFiles(files)
			}

			if (replyMessage) {
				message.replyMessage = {
					_id: replyMessage._id,
					content: replyMessage.content,
					sender_id: replyMessage.senderId
				}

				if (replyMessage.files) {
					message.replyMessage.files = replyMessage.files
				}
			}

			const { id } = await this.messagesRef(roomId).add(message)

			if (files) {
				for (let index = 0; index < files.length; index++) {
					await this.uploadFile({ file: files[index], messageId: id, roomId })
				}
			}

			this.roomsRef.doc(roomId).update({ lastUpdated: new Date() })
		},

		async editMessage({ messageId, newContent, roomId, files }) {
			const newMessage = { edited: new Date() }
			newMessage.content = newContent

			if (files) {
				newMessage.files = this.formattedFiles(files)
			} else {
				newMessage.files = this.deleteDbField
			}

			await this.messagesRef(roomId)
				.doc(messageId)
				.update(newMessage)

			if (files) {
				for (let index = 0; index < files.length; index++) {
					if (files[index]?.blob) {
						await this.uploadFile({ file: files[index], messageId, roomId })
					}
				}
			}
		},

		async deleteMessage({ message, roomId }) {
			const confirmation = window.confirm('Are you sure?');
        // console.log(confirmation);

      if (!confirmation) return;
			await this.messagesRef(roomId)
				.doc(message._id)
				.update({ deleted: new Date() })

			const { files } = message

			if (files) {
				files.forEach(file => {
					const deleteFileRef = this.filesRef
						.child(this.currentUserId)
						.child(message._id)
						.child(`${file.name}.${file.extension || file.type}`)

					deleteFileRef.delete()
				})
			}
		},

		async uploadFile({ file, messageId, roomId }) {
			let type = file.extension || file.type
			if (type === 'svg' || type === 'pdf') {
				type = file.type
			}

			const uploadFileRef = this.filesRef
				.child(this.currentUserId)
				.child(messageId)
				.child(`${file.name}.${type}`)

			const uploadTask = uploadFileRef.put(file.blob, {
				contentType: type
			})

			uploadTask.on(
				'state_changed',
				snap => {
					const progress = Math.round(
						(snap.bytesTransferred / snap.totalBytes) * 100
					)
					this.updateFileProgress(messageId, file.localUrl, progress)
				},
				_error => {},
				async () => {
					const url = await uploadTask.snapshot.ref.getDownloadURL()

					const messageDoc = await this.messagesRef(roomId)
						.doc(messageId)
						.get()

					const files = messageDoc.data().files

					files.forEach(f => {
						if (f.url === file.localUrl) {
							f.url = url
						}
					})

					await this.messagesRef(roomId)
						.doc(messageId)
						.update({ files })
				}
			)
		},

		updateFileProgress(messageId, fileUrl, progress) {
			const message = this.messages.find(message => message._id === messageId)

			if (!message || !message.files) return

			message.files.find(file => file.url === fileUrl).progress = progress
			this.messages = [...this.messages]
		},

		formattedFiles(files) {
			const formattedFiles = []

			files.forEach(file => {
				const messageFile = {
					name: file.name,
					size: file.size,
					type: file.type,
					extension: file.extension || file.type,
					url: file.url || file.localUrl
				}

				if (file.audio) {
					messageFile.audio = true
					messageFile.duration = file.duration
				}

				formattedFiles.push(messageFile)
			})

			return formattedFiles
		},

		openFile({ file }) {
			window.open(file.file.url, '_blank')
		},

		async openUserTag({ user }) {
			if (user._id === this.currentUserId) return
			let roomId

			this.rooms.forEach(room => {
				if (room.users.length === 2) {
					const userId1 = room.users[0]._id
					const userId2 = room.users[1]._id
					if (
						(userId1 === user._id || userId1 === this.currentUserId) &&
						(userId2 === user._id || userId2 === this.currentUserId)
					) {
						roomId = room.roomId
					}
				}
			})

			if (roomId) return (this.roomId = roomId)

			const query1 = await this.roomsRef
				.where('users', '==', [this.currentUserId, user._id])
				.get()

			if (!query1.empty) {
				return this.loadRoom(query1)
			}

			let query2 = await this.roomsRef
				.where('users', '==', [user._id, this.currentUserId])
				.get()

			if (!query2.empty) {
				return this.loadRoom(query2)
			}

			const room = await this.roomsRef.add({
				users: [user._id, this.currentUserId],
				lastUpdated: new Date()
			})

			this.roomId = room.id
			this.fetchRooms()
		},

		async loadRoom(query) {
			query.forEach(async room => {
				if (this.loadingRooms) return
				await this.roomsRef.doc(room.id).update({ lastUpdated: new Date() })
				this.roomId = room.id
				this.fetchRooms()
			})
		},


		async sendMessageReaction({ reaction, remove, messageId, roomId }) {
			const dbAction = remove
				? this.$fireModule.firestore.FieldValue.arrayRemove(this.currentUserId)
				: this.$fireModule.firestore.FieldValue.arrayUnion(this.currentUserId)

			await this.messagesRef(roomId)
				.doc(messageId)
				.update({
					[`reactions.${reaction.unicode}`]: dbAction
				})
		},

		typingMessage({ message, roomId }) {
			if (!roomId) return

			if (message?.length > 1) {
				return (this.typingMessageCache = message)
			}

			if (message?.length === 1 && this.typingMessageCache) {
				return (this.typingMessageCache = message)
			}

			this.typingMessageCache = message

			const dbAction = message
				? this.$fireModule.firestore.FieldValue.arrayUnion(this.currentUserId)
				: this.$fireModule.firestore.FieldValue.arrayRemove(this.currentUserId)

			this.roomsRef.doc(roomId).update({
				typingUsers: dbAction
			})
		},

		async listenRooms(query) {
			const listener = query.onSnapshot(rooms => {
				// this.incrementDbCounter('Listen Rooms Typing Users', rooms.size)
				rooms.forEach(room => {
					const foundRoom = this.rooms.find(r => r.roomId === room.id)
					if (foundRoom) {
						foundRoom.typingUsers = room.data().typingUsers
						foundRoom.index = room.data().lastUpdated.seconds
					}
				})
			})
			this.roomsListeners.push(listener)
		},

		// updateUserOnlineStatus() {
		// 	const userStatusRef = firebase
		// 		.database()
		// 		.ref('/status/' + this.currentUserId)

		// 	const isOfflineData = {
		// 		state: 'offline',
		// 		lastChanged: firebase.database.ServerValue.TIMESTAMP
		// 	}

		// 	const isOnlineData = {
		// 		state: 'online',
		// 		lastChanged: firebase.database.ServerValue.TIMESTAMP
		// 	}

		// 	firebase
		// 		.database()
		// 		.ref('.info/connected')
		// 		.on('value', snapshot => {
		// 			if (snapshot.val() === false) return

		// 			userStatusRef
		// 				.onDisconnect()
		// 				.set(isOfflineData)
		// 				.then(() => {
		// 					userStatusRef.set(isOnlineData)
		// 				})
		// 		})
		// },

		// listenUsersOnlineStatus(rooms) {
		// 	rooms.map(room => {
		// 		room.users.map(user => {
		// 			const listener = firebase
		// 				.database()
		// 				.ref('/status/' + user._id)
		// 				.on('value', snapshot => {
		// 					if (!snapshot || !snapshot.val()) return

		// 					const lastChanged = this.formatTimestamp(
		// 						new Date(snapshot.val().lastChanged),
		// 						new Date(snapshot.val().lastChanged)
		// 					)

		// 					user.status = { ...snapshot.val(), lastChanged }

		// 					const roomIndex = this.rooms.findIndex(
		// 						r => room.roomId === r.roomId
		// 					)

		// 					this.rooms[roomIndex] = room
		// 					this.rooms = [...this.rooms]
		// 				})
		// 			this.roomsListeners.push(listener)
		// 		})
		// 	})
		// },


		// ,incrementDbCounter(type, size) {
		// 	size = size || 1
		// 	this.dbRequestCount += size
		// 	console.log(type, size)
		// }
	}
}
</script>
<style lang="scss">
.vac-icon-textarea {
	div {
		.vac-emoji-wrapper {
			left : 0 !important;
		}
	}
}
.vac-svg-button {
	max-height: 30px;
	display: flex;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		transform: scale(1.1);
		opacity: 0.7;
	}
}
.vac-emoji-wrapper {
		position: relative;
		float:right;
		right: 25px;
		padding: 5px;
			.vac-emoji-reaction svg {
				height: 21px;
				width: 21px;
			}
		}
	// @media screen and (min-width: 501px) {
	// 	.vac-emoji-wrapper {
	// 	position: relative;
	// 	float:right;
	// 	right: 25px;
	// 	padding: 4px;
	// 		.vac-emoji-reaction svg {
	// 			height: 22px;
	// 			width: 22px;
	// 		}
	// 	}
	// }
	.vac-emoji-picker {
		position: absolute;
		z-index: 9999;
		bottom: 32px;
		right: 10px;
		width: 340px;
		padding-top: 4px;
		// overflow: scroll;
		// box-sizing: border-box;
		// border-radius: 0.5rem;
		// background: var(--chat-emoji-bg-color);
		// box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.1),
		// 	0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 1px rgba(0, 0, 0, 0.1);
		// scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		&.vac-picker-reaction {
			// position: fixed;
			top: initial;
			right: initial;
		}

		.emoji-picker {
			height: 100%;
			width: 100%;
			--emoji-size: 1.2rem;
			--background: var(--chat-emoji-bg-color);
			--emoji-padding: 0.4rem;
			--border-color: var(--chat-sidemenu-border-color-search);
			--button-hover-background: var(--chat-sidemenu-bg-color-hover);
			--button-active-background: var(--chat-sidemenu-bg-color-hover);
		}
	}
</style>
<style lang="scss">

@media screen and (max-width: 500px) {
	.chat-container {
		.vac-room-footer {
			position: fixed;
			width: 100%;
			bottom: 0
		}
		
		.vac-input {
			font-size: 16px !important;
		}

		#messages-list {
			padding-bottom: 50px;
		}
	}

}

</style>
<style lang="scss" scoped>
.window-container {
	width: 100%;
}

.window-mobile {
	form {
		padding: 0 10px 10px;
	}
}

form {
	padding-bottom: 20px;
}

input {
	padding: 5px;
	width: 140px;
	height: 21px;
	border-radius: 4px;
	border: 1px solid #d2d6da;
	outline: none;
	font-size: 14px;
	vertical-align: middle;

	&::placeholder {
		color: #9ca6af;
	}
}

button {
	background: #1976d2;
	color: #fff;
	outline: none;
	cursor: pointer;
	border-radius: 4px;
	padding: 8px 12px;
	margin-left: 10px;
	border: none;
	font-size: 14px;
	transition: 0.3s;
	vertical-align: middle;

	&:hover {
		opacity: 0.8;
	}

	&:active {
		opacity: 0.6;
	}

	&:disabled {
		cursor: initial;
		background: #c6c9cc;
		opacity: 0.6;
	}
}

.button-cancel {
	color: #a8aeb3;
	background: none;
	margin-left: 5px;
}

select {
	vertical-align: middle;
	height: 33px;
	width: 152px;
	font-size: 13px;
	margin: 0 !important;
}
</style>
