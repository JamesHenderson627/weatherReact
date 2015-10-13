
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

//===================Collection===================

var DefaultWeatherModel = Backbone.Model.extend({
	url: "https://api.forecast.io/forecast/a8a1d6dd27dd4b8c77724d9b4743bcd2/29.7604,-95.3698",
	
	parse: function(responseData) {
		console.log(responseData)
		return responseData
	}
})

var CurrentWeatherModel = Backbone.Model.extend({
	url: function(){
		return "https://api.forecast.io/forecast/a8a1d6dd27dd4b8c77724d9b4743bcd2/" + this.get("latLon")
	},
	
	parse: function(responseData) {
		console.log(responseData)
		return responseData
	}
})
//=============Views============

var WeatherView = React.createClass({
	render: function() {
		return(
				<div id="weatherWrap"> 
					<Opener weatherData={this.props.weather.attributes} />	
				</div>
			)
	},
})

var Opener = React.createClass({

	_getHourlyData: function(hourlyObj) {
		return (<HourlyInfo hourly={hourlyObj} />)
	},

	_getWeeklyData: function(weeklyObj) {
		return (<WeeklyInfo weekly={weeklyObj} />)
	},

	_getUserQuery: function(event) {
		if (event.keyCode === 13) {
			console.log('------',event)
			location.hash = "weather/" + event.target.value
		}
	},

	render: function() {
		var hourlyData = this.props.weatherData.hourly.data,
			weeklyData = this.props.weatherData.daily.data
		return(
				<div id="opener">
					<h1>Weather Wherever You Wander</h1>
                	<input type="text" placeholder="Lat/Lon" onKeyDown={this._getUserQuery}/>
                	<DefaultInfo />
					<CurrentInfo currently={this.props.weatherData.currently}/>
					{hourlyData.map(this._getHourlyData).slice(0,8)}
					{weeklyData.map(this._getWeeklyData)}
				</div>
			)
	}
})

var DefaultInfo = React.createClass({

	render: function() {
		return(
				<div id="weatherInfo">
                	<div id="weatherIcons">
	                    <i className="pe-7w-sun"></i>
	                    <i className="pe-7w-cloud-sun"></i>
	                    <i className="pe-7w-cloud"></i>
	                    <i className="pe-7w-rain-alt"></i>
	                    <i className="pe-7w-lightning"></i>
	                </div>
				</div>
			)
	}

})

var CurrentInfo = React.createClass({ 

	_getTime: function() {
		var d = new Date(this.props.currently.time * 1000),
			hours = d.getHours(),
			minutes = d.getMinutes()
		if (minutes < 10) minutes = "0" + minutes
		if (hours === 0) {
			return 12 + ":" + minutes + "AM"
		} else if (hours > 12) {
			return (hours - 12) + ":" + minutes + "PM"
		} else {
			return hours + ":" + minutes + "AM"
		}
	},

	render: function() {
		var temperature = Math.floor(this.props.currently.temperature),
			apparentTemp = Math.floor(this.props.currently.apparentTemperature),
			humidity = Math.floor(this.props.currently.humidity * 100),
			summary = this.props.currently.summary,
			time = this._getTime()
		return(
				<div id="weatherInfo">
					
						<h3>Your Local Weather</h3>
						<p>The temperature is {temperature}&#176;</p>
						<p>{summary}</p>
						<p>Feels like {apparentTemp}&#176;</p>
						<p>There is {humidity}&#37; Humidity</p>
						<p>The time is {time}</p>
				
				</div>
			)
	}
})

var HourlyInfo = React.createClass({ 
	
	_getTime: function(time) {
		var d = new Date(this.props.hourly.time * 1000)
		if (d.getHours() > 12) {
			return (d.getHours() - 12) + "PM"
		} else if (d.getHours() === 12) {
			return 12 + "PM"
		} else if (d.getHours() === 0) {
			return 12 + "AM"
		} else {
			return d.getHours() + "AM"
		}
	},

	render: function() {
		var temperature = Math.floor(this.props.hourly.temperature),
			humidity = Math.floor(this.props.hourly.humidity * 100),
			time = this._getTime()
		return(
				<div id="hourlyTemp">
					<p>{time}</p>
					<p>{temperature}&#176;</p>
					<p>{humidity}&#37; Humidity</p>

				</div>
			)
	}
})

var WeeklyInfo = React.createClass({
	
	_getDay: function(time) {
		var d = new Date(this.props.weekly.time * 1000)
		return d.toString().split(" ").slice(0,1).join()
	},

	_getTemp: function(temperature) {
		return Math.floor(temperature)
	},

	render: function (){
		var time = this._getDay(),
			tempMax = this._getTemp(this.props.weekly.temperatureMax),
			tempMin =this._getTemp(this.props.weekly.temperatureMin),
			humidity = Math.floor(this.props.weekly.humidity * 100)
		return(
				<div id="weeklyTemp">
					<p>{time}</p>
					<p>High&#58; {tempMax}&#176;</p>
					<p>Low&#58; {tempMin}&#176;</p>
					<p>{humidity}&#37; Humidity</p>
				</div>
			)
	}
})

//============Router=========
var WeatherRouter = Backbone.Router.extend({
	routes: {
		"weather/:query": "showCurrent",
		"*anyroute": "showDefault"
	},

	// fetcher: function(query) {
 //        this.cwc.set({latLon:query})
 //        console.log(this.wc)

	// 	return this.cwc.fetch({
	// 		dataType: "jsonp",
	// 		processData: true
	// 	})
	// 	console.log("returning data")
	// },

	
	showDefault: function() {
		var self = this
		console.log("getting the default")
		this.dwm.fetch({
			dataType: "jsonp",
			processData: true
		}).done(function(){
			React.render(<WeatherView weather={self.dwm} />,document.querySelector("#container"))
		})
		console.log(this.dwm)
	},

	showCurrent: function(query) {
		var self = this
		self.cwm.set({latLon:query})
		console.log(this.cwm)
		console.log("getting current weather")
		//1 capture the query from the route (expectimng lat/long values)
		console.log(query)
		this.cwm.fetch({
			dataType: "jsonp",
			processData: true
		}).done(function(){
			React.render(<WeatherView weather={self.cwm} />,document.querySelector("#container"))
		})
		console.log(this.cwm)
	},

	initialize: function() {
		this.dwm = new DefaultWeatherModel()
		this.cwm = new CurrentWeatherModel()
		Backbone.history.start()
	}


})

var wr = new WeatherRouter()

	





