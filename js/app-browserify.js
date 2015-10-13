
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

var DefaultWeatherCollection = Backbone.Collection.extend({
	url: "https://api.forecast.io/forecast/a8a1d6dd27dd4b8c77724d9b4743bcd2/29.7604,-95.3698",
	
	parse: function(responseData) {
		console.log(responseData)
		return responseData
	}
})

var CurrentWeatherCollection = Backbone.Collection.extend({
	url: function() {
		"https://api.forecast.io/forecast/a8a1d6dd27dd4b8c77724d9b4743bcd2/" + this.latLon
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
					<Opener weatherData={this.props.weather}/>
				</div>
			)
	},
})

var Opener = React.createClass({
	_getHourlyData: function(object) {
		return (<HourlyInfo hourly={object} />)
	},

	_getWeeklyData: function(object) {
		return (<WeeklyInfo weekly={object} />)
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
	componentDidMount: function() {
		console.log(this)
	}, 

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
	componentDidMount: function() {
		console.log(this)
	}, 

	_getTime: function() {
		var d = new Date(this.props.currently.time * 1000),
			hours = d.getHours(),
			minutes = d.getMinutes()
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
	componentDidMount: function() {
		console.log(this)
	}, 
	
	_getTime: function(time) {
		var d = new Date(this.props.hourly.time * 1000)
		console.log(d)
		console.log(d.getHours())
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
	componentDidMount: function() {
		console.log(this)
	}, 
	
	_getDay: function(time) {
		var d = new Date(this.props.weekly.time * 1000)
		console.log(d)
		return d.toString().split(" ").slice(0,1).join()
		console.log(d)
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
		"*anyroute": "showDefault",
		"weather/:query": "showCurrent"
	},

	topComponent: function(data) {
		console.log('starting to render')
		console.log(data)
		React.render(<WeatherView weather={data} />,document.querySelector("#container"))
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
		console.log("getting current weather")
		this.dwc.fetch({
			dataType: "jsonp",
			processData: true
		}).done(self.topComponent)
	},

	showCurrent: function(query) {
		var self = this
		self.cwc.set({latLon:query})
		console.log("getting current weather")
		//1 capture the query from the route (expectimng lat/long values)
		console.log(query)
		this.cwc.fetch({
			dataType: "jsonp",
			processData: true
		}).done(self.topComponent)
	},

	initialize: function() {
		this.dwc = new DefaultWeatherCollection(),
		this.cwc = new CurrentWeatherCollection(),
		Backbone.history.start()
	}


})

var wr = new WeatherRouter()

	





