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
var movieTitle;
var x = 0;
var poster = "";

// var eventful = "http://api.eventful.com/json/events/search?" + searchParams + "&app_key=TrvGWQVsBrMhNwnd"
// var movieDB = "https://api.themoviedb.org/3/movie/" + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac"

$(document).ready(nowPlaying);

function nowPlaying() {
  // pull currently playing movies from themoviedb
  $.ajax({
    url : "https://api.themoviedb.org/3/movie/now_playing?region=US&api_key=63f47afce4d3b7ed9971fafd26dc56ac",
    method : "GET"
  }).done(function(res){
    var response = res.results;
    for (var i = 0; i < response.length; i++){
      movieTitle = response[i].title;

      database.ref().child('nowPlaying').push({
        title : movieTitle,
        poster : poster
      })
      // pull posters from omdb
      $.ajax({
        url : "http://omdbapi.com/?apikey=40e9cece&t=" + movieTitle,
        method : "GET"
      }).done(function(results){
        // console.log("pulling")
        var posterURL = results.Poster;
        console.log(posterURL)
        database.ref("nowPlaying").update({
          poster : posterURL
        })
      })
    }
  })
}
// pull data from firebase and append

      // poster.attr('id', 'poster' + y)
      // poster.addClass('img')
      // poster.addClass('img-responsive')
      // console.log(res.Poster);
      // var posterDisplay = $('<td>').append(poster);
      // movieDisplay.append(poster);

      // var movieDisplay = $('<tr>').attr('id', 'movie-' + i);

      // console.log(movieTitle)
      // var titleDisplay = $('<td>').append(movieTitle);

      // // var movieDisplay = $('<tr>');
      // movieDisplay.append(titleDisplay)

      // $('#movie-schedule').append(movieDisplay)
      // x++
    // }

//   })


// function getMoviePoster(){
  // $.ajax({
  //   url : "http://omdbapi.com/?apikey=40e9cece&t=wonder+woman",
  //   method : "GET"
  // }).done(function(res){
  //   console.log(res.Poster)
  //   console.log("hello")
  // })
// }
// $.ajax({
//   url : queryURL,
//   method : "GET"
// }).done(function(res){

// })

// use scrollspy on results list

// $(document).ready(getMoviePoster)

$('body').scrollspy({ target: '#now-playing' })