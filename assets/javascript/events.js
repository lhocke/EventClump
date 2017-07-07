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
	document.ref("localEvents").once("value").then(function(snapshot){
    console.log("eventsExist")
	  snapshot.forEach(function(childSnapshot){
	  var eventShow = $('<div>');
	  var name = childSnapshot.val().name;
	  var eventLink = $('<a href="' + childSnapshot.val().url + '">' + name + '</href>');
	  eventLink.attr('id','list');
	  var eventName = $('<div>').append(eventLink);
	  eventName.attr('id','event-name');
	  var eventTime = $('<div>').append(childSnapshot.val().startTime);
	  eventTime.attr('id','event-time');
	  eventShow.append(eventName, eventTime);
	    $('#events-panel-main').append(eventShow);
	})
  })
}