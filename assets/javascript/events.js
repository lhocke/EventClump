// Initialize Firebase
var config = {
  apiKey: "AIzaSyA6OZkjKz0Bq7DrrmQNf87O2K1GHqHURqw",
  authDomain: "eventclump.firebaseapp.com",
  databaseURL: "https://eventclump.firebaseio.com",
  projectId: "eventclump",
  storageBucket: "",
  messagingSenderId: "312877875089"
};
firebase.initializeApp(config);

var database = firebase.database();
$(document).ready(existingEventDatabase);

// database reset
function dataClear(){
  database.ref('nowPlaying').remove();
  database.ref('localEvents').remove();
  database.ref('upcomingMovies').remove();
}

// $(document).ready(existingEventDatabase);
// existingEventDatabase()
function existingEventDatabase() {
	console.log("running")
	database.ref("eventLocation").once("value").then(function(snap){
	  var city = snap.val().city
	  console.log(city)
	  $('#city').html("Events Near " + city);
	})
	database.ref("localEvents").once("value").then(function(snapshot){
	  snapshot.forEach(function(childSnapshot){
		var eventShow = $('<div class="row">');
		var name = childSnapshot.val().name;
		var eventLink = $('<a href="' + childSnapshot.val().url + '">' + name + '</href>');
		eventLink.attr('id','list');
		var eventName = $('<div>').append(eventLink);
		eventName.attr('id','name');
		eventName.addClass('col-md-12')
		var eventTime = $('<div>').append(childSnapshot.val().startTime);
		eventTime.append('<hr>')
		eventTime.attr('id','event-time');
		eventTime.addClass('col-md-12 text-center')
		eventShow.append(eventName, eventTime);
		$('.events-panel-main').append(eventShow);
	})
  })
}