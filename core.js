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
var keyword = "";
var category;
var location;
var currentMovies = "now_playing?region=US&";
// var apiArray = [];

// var queryURL;
var movieTitle = [];
// var movieTitle = {};
var x = 0;
var posterArray = [];

// var eventful = "http://api.eventful.com/json/events/search?" + searchParams + "&app_key=TrvGWQVsBrMhNwnd"
// var movieDB = "https://api.themoviedb.org/3/movie/" + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac"

// $(document).ready()

$(document).ready(getMoviePoster);

database.ref('nowPlaying').on('child_added', nowPlaying);

// reset currently playing movies at midnight
if (moment() === moment().startOf('day')){
  dataClear;
}


// database reset
function dataClear(){
  database.ref('nowPlaying').remove();
};

function getMoviePoster() {
  if (keyword === ""){
    keyword = currentMovies;
  }

  // pull currently playing movies from themoviedb
  $.ajax({
    url : "https://api.themoviedb.org/3/movie/" + keyword + "&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
    method : "GET"
  }).done(function(res){
    var response = res.results;
    console.log(response)
    for (var i = 0; i < response.length; i++){
      var title = {};
      title.name = response[i].title;
      title.id = response[i].id;
      title.imdbID = "";
      movieTitle.push(title);
      // title.name = title;
      // title.id = response[i].id;
    }
    console.log(movieTitle)
    for (var i = 0; i < movieTitle.length; i++){
      console.log(x)
      var id = movieTitle[i].id;
      // var item = movieTitle[i]
      // console.log(movieTitle[i].id)
      $.ajax({
        url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac",
        method : "GET"
      }).done(function(res){
        // console.log(res)
        var imdbID = res.imdb_id;
        // console.log(imdbID)
        console.log(movieTitle)
        movieTitle[x].imdbID = imdbID;
      })
      x++
    }

    // pull info from omdb and log to firebase
    for (var i = 0; i < movieTitle.length; i++){
      var name = movieTitle[i].name;
      // var imdbID = movieTitle[i].imdbID
      // console.log(name);
      $.ajax({
        url : "http://omdbapi.com/?apikey=40e9cece&t=" + name + "&y=" + moment().year(),
        method : "GET"
      }).done(function(results){
        // console.log(results)
        var posterURL = results.Poster;
        // console.log(posterURL)
        var newTitle = results.Title
        database.ref().child("nowPlaying/" + newTitle).update({
          title: newTitle,
          poster : posterURL,
          // id : imdbID
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
  // console.log(snap.val().title)
  var moviePoster = $('<img>').attr('src', snap.val().poster);
  moviePoster.addClass('img img-responsive');
  var displayPoster = $('<td>').append(moviePoster);

  var titleDisplay = $('<td>').append(snap.val().title);

  movieDisplay.append(displayPoster, titleDisplay);
  $('#movie-schedule').append(movieDisplay);
}

// function movieSearch(){
//   keyword = input.val().trim
//   .$ajax({
//     url: 
//   })
// }
