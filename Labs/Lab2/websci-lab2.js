$(document).ready(function() { 
    $("#data").hide(); 
    $("#location").hide();
});

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather);
    } else {
        $("#location").html("Geolocation is not supported by this browser.");
    }
}
function getLocationForecast() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getForecast);
    } else {
        $("#location").html("Geolocation is not supported by this browser.");
    }
}

//set up global variable to store selected units
var unit;
function buttonResponse(val){
    unit = val;
    getLocationWeather();
    getLocationForecast();
}

//to populate the current weather:
function getWeather(location) {
    
    var APIreq;
    if (unit=="F"){
        APIreq = "http://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude+ "&lon=" + location.coords.longitude + "&APPID=d28f2b67e33e29e7b0c17e04a19ff788&units=imperial";
        //change buttons to show which unit is selected:
        $("#unit1").css("color", "black");
        $("#unit1").css("background-color", "#d1d3d6");
        $("#unit2").css("color", "blue");
        $("#unit2").css("background-color", "white");
    }
    else if(unit=="C"){
        APIreq = "http://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude+ "&lon=" + location.coords.longitude + "&APPID=d28f2b67e33e29e7b0c17e04a19ff788&units=metric";
        $("#unit2").css("color", "black");
        $("#unit2").css("background-color", "#d1d3d6");
        $("#unit1").css("color", "blue");
        $("#unit1").css("background-color", "white");
    }
    $.getJSON(APIreq,function(weather){
    	var weather_data = weather;

    	//collect and format data on sunset and sunrise:
    	var sunrise = weather_data["sys"]["sunrise"];
    	//convert UTC time to normal time
    	var sunrise_date = new Date(sunrise * 1000);
    	sunrise = sunrise_date.toLocaleTimeString();

    	//repeat above for sunset:
    	var sunset = weather_data["sys"]["sunset"];
    	//convert UTC time to normal time
    	var sunset_date = new Date(sunset * 1000);
    	sunset = sunset_date.toLocaleTimeString();

    	$("#sun").html("Today's sunrise is at <span id='sunrise-font'>" + sunrise + "</span>, and the sunset is at <span id='sunset-font'>" + sunset + "</span>.");
    	
    	//update location name:
    	$("#location").html("You are located in: <span id='city'>" + weather_data["name"] + "</span>");

    	//update temperatures and description:
    	$("#curr_temp").html(Math.round(weather_data["main"]["temp"]) + "&deg;");
    	$("#high").html("<b>High: </b>" + Math.round(weather_data["main"]["temp_max"]) + "&deg;");
    	$("#low").html("<b>Low: </b> " + Math.round(weather_data["main"]["temp_min"]) + "&deg;");
    	
    	//format the description:
    	var descrip = (weather_data["weather"]["0"]["description"])[0].toUpperCase() + (weather_data["weather"]["0"]["description"]).substr(1,);
    	$("#descrip").html(descrip);

    	//add the icon:
    	$("#icon").html("<img src='http://openweathermap.org/img/w/" + weather_data["weather"]["0"]["icon"] + ".png'>");

    	//humidity, wind and visibility:
    	$("#humidity").html("<b>Humidity:</b> " + weather_data["main"]["humidity"] + "%");
    	$("#wind").html("<b>Wind:</b> " + weather_data["wind"]["speed"] + "m/s at " + weather_data["wind"]["deg"] + " degrees");
    	$("#visibility").html("<b>Visibility:</b> " + weather_data["visibility"] + " meters");

    $("#data").fadeIn(1000);
    $("#location").fadeIn(1000);
    });
}

//to populate the forecast:
function getForecast(location){
    $("#forecast-list").hide();
    var APIreq2;
    if (unit=="F"){
        APIreq2 = "http://api.openweathermap.org/data/2.5/forecast?lat=" + location.coords.latitude+ "&lon=" + location.coords.longitude + "&APPID=d28f2b67e33e29e7b0c17e04a19ff788&units=imperial";
    }
    else if(unit=="C"){
        APIreq2 = "http://api.openweathermap.org/data/2.5/forecast?lat=" + location.coords.latitude+ "&lon=" + location.coords.longitude + "&APPID=d28f2b67e33e29e7b0c17e04a19ff788&units=metric";
    }
    $.getJSON(APIreq2,function(forecast){
        //clear out section that holds forecast, in case of unit change:
        $("#forecast-list").html("");
        //forecast holds the weather data every three hours for five days, for a total of 40 entries.

        //go through a loop to determine the high/low for each day in the forecase:
        //iterate through all temps for each day and add the max high and the min low to respective lists.
        var j = 0;
        var k = 0;
        var maxhigh = -100;
        var minlow = 100;
        var highs = [];
        var lows = [];
        var currentday = new Date();
        currentday = currentday.getDate();

        //this loop skips past any of the forecast for the rest of the current day:
        var counter = 0;
        while ((forecast["list"][counter]["dt_txt"]).substring(8,10) == currentday){
            counter++;
        }

        var end = forecast["list"].length-counter;
        while (j < 5){
            k = 0;
            maxhigh = -100;
            minlow = 100;
            //starting at 12:00AM on the first day of the forecast, go through the 8 given data points:
            while (k < 8 && counter < end){

                //compare the current max high temp with the high temp for this data point:
                if (maxhigh < forecast["list"][counter]["main"]["temp_max"]){
                    maxhigh = forecast["list"][counter]["main"]["temp_max"];
                }

                //compare the current min low temp with the min temp for this data point:
                if (minlow > forecast["list"][counter]["main"]["temp_min"]){
                    minlow = forecast["list"][counter]["main"]["temp_min"];
                }
                k+=1;
                counter+=1;
            }
            //populate the highs and lows arrays with each day's high and low calculated above:
            highs[j] = maxhigh;
            lows[j] = minlow;
            j+=1; //go to next day
        }

        //start i at next day + 4 so it represents 12pm on the first day
        var i = 0;
        while ((forecast["list"][i]["dt_txt"]).substring(8,10) == currentday){
            i++;
        }
        i = i+4;

        var n = 0; //n will iterate through the highs/lows lists

    	//go through all weather data entries over next 5 days:
    	while (i < 40){

    		//format date of entry:
    		var d2= new Date(forecast["list"][i]["dt_txt"]);
    		var ds = d2.toString();
    		ds = ds.substr(0,11);

    		//format weather description: 
    		var descrip2 = (forecast["list"][i]["weather"]["0"]["description"])[0].toUpperCase() + (forecast["list"][i]["weather"]["0"]["description"]).substr(1,);

    		//populate each row with the 12pm stats for that day
    		$("#forecast-list").append("<div class='row' id='day'>\
    			<div class='col-sm-4 my-auto'>\
    			<div id='icon'><img id='lower-icon' src='http://openweathermap.org/img/w/" + forecast["list"][i]["weather"]["0"]["icon"] + ".png'></div>\
    			<div id='descrip'>" + descrip2 + "</div>\
    			</div>\
    			<div class='col-sm-4 my-auto'>\
    			<div id='date'>" + ds + "</div>\
    			<div id='curr_temp'>" + Math.round(highs[n]) + "&deg; | " + Math.round(lows[n]) + "&deg;</div>\
    			</div>\
    			<div class='col-sm-4 my-auto' id='other_stats'>\
	    			<div id='humidity'><b>Humidity:</b> " + forecast["list"][i]["main"]["humidity"] + "%</div>\
	          		<div id='wind'><b>Wind:</b> " +  forecast["list"][i]["wind"]["speed"] + " m/s at " + forecast["list"][i]["wind"]["deg"] + " degrees</div>\
    			</div>\
    			</div>");
    		i+=8;
            n+=1;
    	}
        $("#forecast-list").fadeIn(1000);
    });
}

