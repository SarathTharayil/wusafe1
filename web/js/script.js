
let eventDispatcher = new Vue();

let notification = Vue.component('notification', {
	
	props: ['person', 'type', 'lat', 'lang', 'customMessage', 'index', 'trustedContacts'],

	data: function() {
		return {
			medical: false,
			physical: false,
			message: false,
			auto: false,
			heading: ''
		}
	},

	methods: {

		expandDetails: function() {

			eventDispatcher.$emit( 'expand', { person: this.person, type: this.type, lat:this.lat, lang: this.lang, customMessage: this.customMessage, heading: this.heading } )

		},


		setHeading : function() {

			switch( this.type ) {

				case "1": 
					this.heading = this.person + ' Is Requesting Medical Assistance'
					break;
				case "2":
					this.heading = this.person + ' Is Requesting Physical Assistance'
					break;
				case "3":
					this.heading = this.person + ' Sent A Custom Message '
					break;
				case "4":
					this.heading = 'Pulse Rate Of ' + this.person + 'Is Having A Higher Pulse Rate'
					break;

			}								

		}

	},

	computed : {

		typeString: function() {

			this.medical = false
			this.physical = false
			this.message = false
			this.auto = false

			switch( this.type ) {

				case "1": 
					this.medical  = true;
					return 'Medical Assistance';
					break;
				case "2":
					this.physical = true;
					return 'Physical Assistance';
					break;
				case "3":
					this.message = true
					return 'Custom Message';
					break;
				case "4":
					this.auto = true
					return 'Pulse Rate';
					break;

			}

		},

	},

	created() {

		this.setHeading()

	},

	template: `
		
		<a href="#" class="notification-link" style="text-decoration: none;" :class=" { medical: medical, physical: physical, message: message, auto: auto } " @click="expandDetails">

			<span v-show="type == '1'">
				<span class="name"> {{ person }} </span> requested <span> {{ typeString }} </span>
			</span>

			<span v-show="type == '2'">
				<span class="name"> {{ person }} </span> requested <span> {{ typeString }} </span>
			</span>

			<span v-show="message">
				Custom Message From <span class="name"> {{ person }} </span> 
				<span class="customMessage"> {{ customMessage }} </span>
			</span>

			<span v-show="auto">
				<span class="name"> {{ person }} </span> is having an unusual pulse rate
			</span>

		</a>

	`
})

let app = new Vue( {
	el: '#site-wrapper',
	data: {
		notificationSelected: false,
		database : '',
		requests: [],
		lat: 9.931233,
		lng: 76.267303,
		showDetails: false,
		trustedContacts: []
	},

	methods: {
		
		loadFirebase: function() {

			var firebaseConfig = {
				apiKey: "AIzaSyBfYnr-s0XqTx_SPmIM8UiNeUGuf_ViXhE",
				authDomain: "wusafe-8ed7a.firebaseapp.com",
				databaseURL: "https://wusafe-8ed7a.firebaseio.com",
				projectId: "wusafe-8ed7a",
				storageBucket: "",
				messagingSenderId: "456127462030",
				appId: "1:456127462030:web:fb1b4560a1ea1c58"
			};
			
			firebase.initializeApp(firebaseConfig);

		},

		getUserData: function(request) {

			console.log( request )

			let userRef = this.database.ref('/Users/' + request['uid']);
			let that = this;

			userRef.on('value', function( valueSnapshot) {
				
				let userData =  valueSnapshot.val()				

				request['userData'] = userData

				that.requests.push( request )

				// console.log(request['uid'])

				// that.requests[request['uid']] = request
			})

		},

		listenForRequests: function() {

			let requestRef = this.database.ref('/requests')

			let that = this;

			requestRef.on('value', function(valueSnapshot) {

				that.requests = []
				
				let requestData = valueSnapshot.val()

				console.log( requestData )

				for( request in requestData ) {
					if( request ) 
						that.getUserData( requestData[request] )
				}

//				that.getUserData( requestData )
	
			})

		},

		initMap : function( lat, lng ) {

			let map = new google.maps.Map( document.getElementById('map'), { 
				center: { lat: lat , lng: lng },
				zoom: 20
			} )

			let marker = new google.maps.Marker( {position: { lat: lat, lng: lng }, map: map} );


		}
	},



	created: function() {

		this.loadFirebase()

		this.database = firebase.database()

		this.listenForRequests()

		let that = this

		eventDispatcher.$on( 'expand', function( data ) {
			
			that.showDetails = true;

			console.log(data)
			
			let heading = document.getElementById( 'details-heading' ),
				name = document.getElementById( 'details-name' ),
				phone = document.getElementById( 'details-phone' )

			heading.innerHTML = data.heading
			name.innerHTML = data.person

			initMap( data.lat, data.lang )

		} )		

	}
} )