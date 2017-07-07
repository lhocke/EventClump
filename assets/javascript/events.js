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

$("#search_button").on("click",function(){
  var searchTerm = $(".form-control").val();
	if(searchTerm !== ""){
	  console.log("Search-->"+searchTerm);
	  //Execute function to find relavant Geco codes and create map
	  getGeoCoords(searchTerm);
	  database.ref("eventLocation").set({
	  	city : searchTerm
	  })
	  $('.form-control').val('')
	}
	else {
	  console.log("Empty Search");
	  return false;
	}
});

// $(document).ready(existingEventDatabase);
// existingEventDatabase()
function existingEventDatabase() {
	database.ref("eventLocation").once("value").then(function(snap){
	  var city = snap.val().city
	  // console.log(city)

	  $('#city').html("Events Near " + city);
	})
	database.ref("localEvents").once("value").then(function(snapshot){
		console.log(snapshot)
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
		eventShow.addClass("local-events");
		$('.events-panel-main').append(eventShow);
	})
  })
}

function getGeoCoords (prefLocation ){
  var geocoder =  new google.maps.Geocoder();
  geocoder.geocode( { 'address':prefLocation+',US'}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      latitude = results[0].geometry.location.lat();
      longitude = results[0].geometry.location.lng();
      console.log("Lat -->"+latitude+"Long -->"+longitude);
      eventPull()
    }
    else {
    console.log("Something went wrong " + status);
    latitude = 0;
    longitude = 0;
    }
  });
}

function eventPull(){
  database.ref('localEvents').remove();
  $('.local-events').remove();
  var folder = "localEvents/";
  $.ajax({
    url : "https://www.eventbriteapi.com/v3/events/search/?token=QWYUE4VYFCZZZJPSYKLV&location.latitude=" + latitude + "&location.longitude=" + longitude + "&location.within=25mi",
    method : "GET"
  }).done(function(res){
    // console.log(res)
    events = res.events;
    for (var i = 0; i < events.length; i++){
      // console.log(events[i])
      var name = events[i].name.text
      var start = events[i].start.local;
      start = moment(start).format("YYYY-MM-DD h:mm a")
      database.ref().child(folder + "event" + i).update({
        name : name,
        url : events[i].url,
        startTime : start
      });
    }
  existingEventDatabase()
  });
}