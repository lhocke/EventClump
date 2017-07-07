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

// movie variables
var genre;
var queryURL;
var keyword = "";
var category;
var currentMovies = "now_playing?region=US&";
var databaseExists = false;
var movieTitle = [];
var upcomingMovies = [];
var idStore = [];
var upcomingID =[];
var posterArray = [];

// event variables
var eventDate = "";
var eventTime = "";

// $(document).ready()
$(document).ready(movieDataCheck);
$(document).ready(eventDataCheck);
$(document).ready(upcomingMovieDataCheck);


// reset currently playing movies at midnight
if (moment() === moment().startOf('day')){
  dataClear();
}

// $('#search-go').on('click', runAll)

// database reset
function dataClear(){
  database.ref('nowPlaying').remove();
  database.ref('localEvents').remove();
  database.ref('upcomingMovies').remove();
}

// check for existing database and load page
function movieDataCheck(){
  database.ref("nowPlaying").once("value").then(function(snapshot){
    databaseExists = snapshot.exists();
    // console.log(databaseExists);
    if (databaseExists === true) {
      database.ref("nowPlaying").once("value", existingMovieDatabase);
        // console.log("second");
    }

    else {
      // console.log("first else");
      $(document).ready(getMoviePoster);
      // console.log("dataCheck else 2");
      database.ref('nowPlaying').on('child_added', imdbPoster);
      // console.log("dataCheck");
      database.ref('nowPlaying/').on("child_changed", nowPlaying);
    }
  })
}

function eventDataCheck(){
  database.ref("localEvents").once("value").then(function(snapshot){
    databaseExists = snapshot.exists()
    if (databaseExists === true){
      database.ref("localEvents").once("value", existingEventDatabase),function(err){
        console.log(err.code)
      };
    }

    else {
      $(document).ready(eventPull);
      database.ref("localEvents").on("child_added", eventDisplay),function(err){
        console.log(err.code)
      }
    }
  })
}

function upcomingMovieDataCheck(){
  var movieTitle = [];
  // var upcomingMovies = [];
  var idStore = [];
  // var upcomingID =[];

  database.ref("upcomingMovies").once("value").then(function(snapshot){
    databaseExists = snapshot.exists()
    if (databaseExists === true){
      return
    }
    else {
      $(document).ready(upcomingPull);
      database.ref("upcomingMovies").on("child_added", upcomingPoster),function(err){
        console.log(err.code);
      }
    }
  })
}

function upcomingPull() {
  var movieTitle = [];
  // var upcomingMovies = [];
  var idStore = [];
  // var upcomingID =[];
  var folder = "upcomingMovies/"
  $.ajax({
      url : "https://api.themoviedb.org/3/movie/upcoming?region=US&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
      method : "GET"
    }).done(function(response){
      var response = response.results;
      for (var i = 0; i < response.length; i++){
        // console.log(response[i].title)
        var title = {id : response[i].id,
          name : response[i].title};
        upcomingMovies.push(title);
        // console.log(upcomingMovies[i].name)
      }

      for (i = 0; i < upcomingMovies.length; i++){
        var id = upcomingMovies[i].id;
        // console.log(upcomingMovies[i].name);
        $.ajax({
          url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac",
          method : "GET"
        }).done(function(response){
          var imdbID = response.imdb_id;
          var newURL = "imdb.com/title/" + imdbID;
          // console.log(response.title)
        // console.log(newURL)
          upcomingID.push(imdbID);
          database.ref().child(folder + response.title).update({
            imdbID : imdbID,
            title : response.title,
            movieURL : newURL
          });
        });
      }
    });

}

// fetch movies and create database
function getMoviePoster() {
  // pull currently playing movies from themoviedb
  if (keyword === ""){
    keyword = currentMovies;
    var folder = "nowPlaying/";
    // pull currently playing movies from themoviedb
    $.ajax({
      url : "https://api.themoviedb.org/3/movie/" + keyword + "&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
      method : "GET"
    }).done(function(res){
      var response = res.results;
      for (var i = 0; i < response.length; i++){
        var title = {id : response[i].id,
          name : response[i].title};
        movieTitle.push(title);
      }
      for (i = 0; i < movieTitle.length; i++){
        var id = movieTitle[i].id;
        $.ajax({
          url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac",
          method : "GET"
        }).done(function(res){
          var imdbID = res.imdb_id;
          var newURL = "imdb.com/showtimes/title/" + imdbID + "?date=" + moment().format("YYYY-MM-DD");
        // console.log(newURL)
          idStore.push(imdbID);
          database.ref().child(folder + res.title).update({
            imdbID : imdbID,
            title : res.title,
            showtimesURL : newURL
          });
        });
      }
    });
  }
  // else {
  //   keyword = $('search-bar').val().trim()
  //   var folder = "userSearch/"
  //     // if user entered a title
  else {
    keyword = $('search-bar').val().trim();
    var folder = "userSearch/";
    $.ajax({
      url: "http://www.omdbapi.com/?apikey=40e9cece&s=" + keyword,
      method : "GET"
    }).done(function(results){
      for (var i = 0; i < results.length; i++){
        // console.log(results[i].title)
        var newURL = "imdb.com/showtimes/title/" + results.imdbID + "?date=" + moment().format("YYYY-MM-DD");
        // console.log(newURL)
        database.ref().child(folder + results.title).update({
          title : results.title,
          imdbID : results.imdbID,
          poster : results.Poster,
          year : results.Year,
          showtimesURL : newURL
        });
      }
    });
  }
}
// fetch movie posters using imdb id for accuracy
function imdbPoster(){
  // console.log("running")
  for (var x = 0; x < idStore.length; x++){
    // console.log("running")
    var imdbID = idStore[x];
    // console.log(imdbID)
    $.ajax({
      url : "https://omdbapi.com/?apikey=40e9cece&i=" + imdbID,
      method : "GET"
    }).done(function(results){
      var rating = results.Rated;
      var posterURL = results.Poster;
      var newTitle = results.Title;
      database.ref().child("nowPlaying/" + newTitle).update({
        poster : posterURL,
        rating : rating
      });
    });
  }
}

function upcomingPoster() {
  // console.log("running")
  // console.log(upcomingID)
  for (var x = 0; x < upcomingID.length; x++){
    // console.log("running")
    var imdbID = upcomingID[x];
    // console.log(upcomingID[x])
    $.ajax({
      url : "https://omdbapi.com/?apikey=40e9cece&i=" + imdbID,
      method : "GET"
    }).done(function(results){
      // console.log("ran ajax")
    // console.log(results.Poster)
      var rating = results.Rated;
      var posterURL = results.Poster;
      // console.log(posterURL)
      var newTitle = results.Title;
      // console.log(newTitle)
      database.ref().child("upcomingMovies/" + newTitle).update({
        poster : posterURL,
        rating : rating
      })
    });
  }
}

// pull information from firebase to create display
function nowPlaying(snap, prevChildKey){
  // console.log("run");
  var movieDisplay = $('<tr>');
  var moviePoster = $('<img>').attr('src', snap.val().poster);
  moviePoster.addClass('img img-responsive');
  var displayPoster = $('<td>').append(moviePoster);
  displayPoster.attr('id', 'movie-poster')
  movieURL = $('<a href="http://' + snap.val().showtimesURL + '">' + snap.val().title + '</href>')
  movieURL.attr('id', 'list')
  var titleDisplay = $('<td>').append(movieURL);
  titleDisplay.attr('id','movie-title')
  movieDisplay.append(displayPoster, titleDisplay);
  $('#movie-schedule').prepend(movieDisplay);
}

function existingMovieDatabase(snapshot){
  snapshot.forEach(function(childSnapshot){
    var movieDisplay = $('<tr>');
    var moviePoster = $('<img>').attr('src', childSnapshot.val().poster);
    moviePoster.addClass('img img-responsive');
    var displayPoster = $('<td>').append(moviePoster);
    displayPoster.attr('id', 'movie-poster')
    movieURL = $('<a href="http://' + childSnapshot.val().showtimesURL + '">' + childSnapshot.val().title + '</href>');
    movieURL.attr('id', "list")
    var titleDisplay = $('<td>').append(movieURL);
    titleDisplay.attr('id','movie-title')
    movieDisplay.append(displayPoster, titleDisplay);
    $('#movie-schedule').append(movieDisplay);
  });
}

// events
function eventPull(){
  var folder = "localEvents/";
  $.ajax({
    url : "https://www.eventbriteapi.com/v3/events/search/?token=QWYUE4VYFCZZZJPSYKLV&categories=103&price=free&location.address=Oakland+CA&location.within=25mi",
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
  });
}

function eventDisplay(snap, prevChildKey){
  var eventShow = $('<tr>');
  var eventLink = $('<a href="' + snap.val().url + '">' + snap.val().name + '</href>');
  eventLink.attr('id','list')
  var eventName = $('<td>').append(eventLink);
  eventName.attr('id','event-name');
  var eventTime = $('<td>').append(snap.val().startTime);
  eventTime.attr('id','event-time');
  eventShow.append(eventName,eventTime);
  $('#events-schedule').append(eventShow);
}

function existingEventDatabase(snapshot) {
  // console.log("eventsExist")
    snapshot.forEach(function(childSnapshot){
    var eventShow = $('<tr>');
    var name = childSnapshot.val().name;
    var eventLink = $('<a href="' + childSnapshot.val().url + '">' + name + '</href>');
    eventLink.attr('id','list');
    var eventName = $('<td>').append(eventLink);
    eventName.attr('id','event-name');
    var eventTime = $('<td>').append(childSnapshot.val().startTime);
    eventTime.attr('id','event-time');
    eventShow.append(eventName, eventTime);
    $('#events-schedule').append(eventShow);
  })
}