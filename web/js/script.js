
let notifications = Vue.component('notifications', {
	
	props: ['items'],

	data: function() {
		return {
			
		}
	},

	template: `<ul><h6 v-for='notification in items'> <p> {{ notification }} </p> </h6></ul>`
})

let app = new Vue( {
	el: '#site-wrapper',
	data: {
		notificationSelected: false
	}
} )