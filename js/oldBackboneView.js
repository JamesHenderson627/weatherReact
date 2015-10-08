var CurrentView = Backbone.View.extend ({
	el: "#weatherInfo",

	getApparentTemp: function() {
		return Math.floor(this.model.attributes.currently.apparentTemperature)
	},

	getActualTemp: function() {
		return Math.floor(this.model.attributes.currently.temperature)
	},

	getHumidity: function() {
		return Math.floor(this.model.attributes.currently.humidity * 100)
	},

	getSummary: function() {
		return this.model.attributes.currently.summary
	},

	getTime: function() {
		var d = new Date(this.model.attributes.currently.time * 1000)
		var minutes = d.getMinutes()
		if (minutes < 10) {minutes = 0 + minutes}
		if (d.getHours() > 12) {
			return (d.getHours() - 12) + ":" + minutes + "PM"
		} else {
			return d.getHours() + ":" + minutes + "AM"
		}
	},

	render: function() {
		console.log("Here comes the Current Weather!")
		// console.log(this.model)
		this.$el.html(`
			<div id="currentTemp">\
				<p>The temperature is ${this.getActualTemp()}&#176;</p>\
				<p>${this.getSummary()}</p>\
				<p>Feels like ${this.getApparentTemp()}&#176;</p>\
				<p>There is ${this.getHumidity()}&#37; Humidity</p>\
				<p>The time is ${this.getTime()}</p>\
			</div>
			`)
	},

	initialize: function(){}
})