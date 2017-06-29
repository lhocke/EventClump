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
var queryURL;

// var eventful = "http://api.eventful.com/json/events/search?" + searchParams + "&app_key=TrvGWQVsBrMhNwnd"
// var movieDB = "https://api.themoviedb.org/3/movie/" + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac"

$(document).ready(nowPlaying);

function nowPlaying() {
  $.ajax({
    url : "https://api.themoviedb.org/3/movie/now_playing?region=US&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
    method : "GET"
  }).done(function(res){
    var response = res.results;
    for (var i = 0; i < response.length; i++){
      var title = response[i].title;
      console.log(title)
      var titleDisplay = $('<td>').append(title);

      var movieDisplay = $('<tr>');
      movieDisplay.append(titleDisplay)
      $('#movie-schedule').append(movieDisplay)
    }

  })
}

// $.ajax({
//   url : queryURL,
//   method : "GET"
// }).done(function(res){

// })

// use scrollspy on results list

$('body').scrollspy({ target: '#now-playing' })