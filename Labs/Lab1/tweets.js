var req = new XMLHttpRequest();
req.open("GET", "TwitterTweets17.json", false);
req.send(null)
var tweets = JSON.parse(req.responseText);
var i=0;
//initialize first 5 tweets:
for (i; i < 5;i++){
		$(".tweets").prepend('<li><div id="tweet' + i +'" class="row"><div class="col-sm-3" id="username"><img id="pro-pic" \
		src="https://twitter.com/' +tweets[i]["user"]["screen_name"] + '/profile_image?size=mini">\
		' + tweets[i]["user"]["screen_name"] + '</div><div class="col-sm-6" id="tweet">'+ tweets[i]["text"] +'</div><div class="col-sm-3" id="date">'+ (tweets[i]["created_at"]).substr(0,20) + (tweets[i]["created_at"]).substr(26) +'</div></div></li>');	
}


//refresh tweets every 3 seconds:
setInterval(function() {

	//fadeout tweet at the bottom (i-5th tweet):
	var num = i-5;
	$("#tweet" + num).fadeOut(1000);

	//add tweet to the top, giving it a specific numerical id
	//include try/catch statement in case of unexpected entry in json file:
	try{
		$(".tweets").prepend('<li><div id="tweet' + i +'" class="row"><div class="col-sm-3" id="username"><img id="pro-pic" src="https://twitter.com/' +tweets[i]["user"]["screen_name"] + '/profile_image?size=mini">' + tweets[i]["user"]["screen_name"] + '</div><div class="col-sm-6" id="tweet">'+ tweets[i]["text"] +'</div><div class="col-sm-3" id="date">'+ (tweets[i]["created_at"]).substr(0,20) + (tweets[i]["created_at"]).substr(26) +'</div></div></li>');	
		$("#tweet" + i).hide();
		$("#tweet" + i).fadeIn(1000);
	}
	
	catch(err){
		$(".tweets").prepend('<li><div id="tweet' + i +'" class="row"><div class="col-sm-3" id="username"><img id="pro-pic" src="pic.jpg"/>ERROR</div><div class="col-sm-6" id="tweet">ERROR: Tweet no longer exists</div><div class="col-sm-3" id="date">ERROR</div></div></li>');	
	}
	i+=1;
}, 3000);

