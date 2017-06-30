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

var genre;
var queryURL;
var keyword;
var category;
var location;

// var queryURL;
var movieTitle = [];
var x = 0;
var posterArray = [];

// var eventful = "http://api.eventful.com/json/events/search?" + searchParams + "&app_key=TrvGWQVsBrMhNwnd"
// var movieDB = "https://api.themoviedb.org/3/movie/" + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac"

// $(document).ready()

$(document).ready(getMoviePoster);

database.ref('nowPlaying').on('child_added', nowPlaying);

function getMoviePoster() {
  // pull currently playing movies from themoviedb
  $.ajax({
    url : "https://api.themoviedb.org/3/movie/now_playing?region=US&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
    method : "GET"
  }).done(function(res){

    var response = res.results;
    for (var i = 0; i < response.length; i++){
      var title = response[i].title;
      movieTitle.push(title);
    }
    // pull info from omdb and log to firebase
    for (var i = 0; i < movieTitle.length; i++){
      var title = movieTitle[i];
      console.log(title);
      $.ajax({
        url : "http://omdbapi.com/?apikey=40e9cece&t=" + title,
        method : "GET"
      }).done(function(results){
        console.log(results)
        var posterURL = results.Poster;
        console.log(posterURL)
        var newTitle = results.Title
        database.ref().child("nowPlaying/" + newTitle).update({
          title: newTitle,
          poster : posterURL,
        })
      })
    }
  })
}

// pull information from firebase
function nowPlaying(snap, prevChildKey){
  // getMoviePoster;
  var movieDisplay = $('<tr>');
  // create image data for table
  console.log(snap.val().title)
  var moviePoster = $('<img>').attr('src', snap.val().poster);
  moviePoster.addClass('img img-responsive');
  var displayPoster = $('<td>').append(moviePoster);

  var titleDisplay = $('<td>').append(snap.val().title);

  movieDisplay.append(displayPoster, titleDisplay);
  $('#movie-schedule').append(movieDisplay);
}
