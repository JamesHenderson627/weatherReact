
// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

console.log('loaded javascript')
// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

//googleAPi: AIzaSyBz4wrrKqD7Tr63OWeMOtdTJWkuXS1kEyA

//=============Collection=========
// var WeatherCollection = Backbone.Collection.extend({
// 	url: "https://api.forecast.io/forecast/a8a1d6dd27dd4b8c77724d9b4743bcd2/29.7604,-95.3698",
	
// 	parse: function(responseData) {
// 		console.log(responseData)
// 		return responseData
// 	}	
// })
//=============Views============

var WeatherView = React.createClass({
	render: function() {
		return(
				<div id="weatherWrap"> 
					<Opener />
					<WeatherInfo />
				</div>
			)
	},
})

var Opener = React.createClass({
	render: function() {
		return(
				<div id="opener">
					<h1>Weather Wherever You Wander</h1>
                	<input type="text" placeholder="Lat/Lon" />
				</div>
			)
	}
})

var WeatherInfo = React.createClass({

	render: function() {
		return(
				<div id="weatherInfo">
					<h3>Your Local Weather</h3>
                	<div id="weatherIcons">
	                    <i className="pe-7w-sun"></i>
	                    <i className="pe-7w-cloud-sun"></i>
	                    <i className="pe-7w-cloud"></i>
	                    <i className="pe-7w-rain-alt"></i>
	                    <i className="pe-7w-lightning"></i>
	                </div>
	                <CurrentTemp />
				</div>
			)
	}

})

var CurrentTemp = React.createClass({
	
	getInitialState: function() {
		console.log("Getting Initial State")
		return{
				currentDisplay: "none"
			}
	},

	render: function() {
		var displayObj = {display:this.state.currentDisplay}
		return(
				<div id="currentTemp">
					<button type="button" id="current">Current</button>
                    <button type="button" id="hourly">Hourly</button>
                    <button type="button" id="daily">5 Day</button>
				</div>
			)
	}
})

// var HourlyTemp = React.createClass({
// 	getInitialState: function() {
// 		console.log("Getting Initial State")
// 		return{
// 				currentDisplay: "none"
// 			}
// 	},
	
// 	render: function() {
// 		var displayObj = {display:this.state.currentDisplay}
// 		return(
// 				<div id="hourlyTemp">
// 					<button type="button" id="current">Current</button>
//                     <button type="button" id="hourly">Hourly</button>
//                     <button type="button" id="daily">5 Day</button>
// 				</div>
// 			)
// 	}
// })

// var WeeklyTemp = React.createClass({
// 	getInitialState: function() {
// 		console.log("Getting Initial State")
// 		return{
// 				currentDisplay: "none"
// 			}
// 	},
	
// 	render: function() {
// 		var displayObj = {display:this.state.currentDisplay}
// 		return(
// 				<div id="weeklyTemp">
// 					<button type="button" id="current">Current</button>
//                     <button type="button" id="hourly">Hourly</button>
//                     <button type="button" id="daily">5 Day</button>
// 				</div>
// 			)
// 	}
// })

var renderApp = function() {
	console.log("rendering!"),
	React.render(<WeatherView />,document.querySelector("#container"))
}

renderApp()

// ============Router=========
// var WeatherRouter = Backbone.Router.extend({
// 	routes:{
// 	"*anyroute": "showDefault"
// 	},

// 	// renderApp: function(data) {
// 	// 	console.log("rendering the view!")
// 	// 	React.render(<WeatherView weather={data.attributes}/>,document.querySelector("#container"))
// 	// },

// 	initialize: function() {
// 		this.wc = new WeatherCollection(),
// 		Backbone.history.start()
// 	}


// })

// var wr = new WeatherRouter()

	





