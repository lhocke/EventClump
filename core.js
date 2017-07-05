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
var databaseExists = false;
var movieTitle = [];
var idStore = [];
// var movieTitle = {};
// var x = 0;
var posterArray = [];

// var eventful = "http://api.eventful.com/json/events/search?" + searchParams + "&app_key=TrvGWQVsBrMhNwnd"
// var movieDB = "https://api.themoviedb.org/3/movie/" + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac"

// $(document).ready()

$(document).ready(dataCheck);

// reset currently playing movies at midnight
if (moment() === moment().startOf('day')){
  dataClear;
}

// $('#search-go').on('click', runAll)

// database reset
function dataClear(){
  database.ref('nowPlaying').remove();
};

// check for existing database and load page
function dataCheck(){
  database.ref("nowPlaying").once("value").then(function(snapshot){
    databaseExists = snapshot.exists()
    console.log(databaseExists)
    if (databaseExists === true) {
      database.ref("nowPlaying").once("value", existingDatabase),function(err){
        console.log(err.code)};
        console.log("second")
    }

    else {
      console.log("first else")
      $(document).ready(getMoviePoster),function(err){
        console.log(err.code)};
      console.log("dataCheck else 2")
      database.ref('nowPlaying').on('child_added', imdbPoster),function(err){
        console.log(err.code)};
      console.log("dataCheck")
      database.ref('nowPlaying/').on("child_changed", nowPlaying),function(err){
        console.log(err.code)};
    }
  })
}

// fetch movies and create database
function getMoviePoster() {
  if (keyword === ""){
    keyword = currentMovies;
    var folder = "nowPlaying/"
  }
  else {
    keyword = $('search-bar').val().trim()
    var folder = "userSearch/"
  }

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
      // database.ref().child(folder + response[i].title).update({
      //   title: response[i].title,
      //   movieDBid: response[i].id
      // })
    }
    for (var i = 0; i < movieTitle.length; i++){
      var id = movieTitle[i].id;
      $.ajax({
        url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=63f47afce4d3b7ed9971fafd26dc56ac",
        method : "GET"
      }).done(function(res){
        var imdbID = res.imdb_id;
        idStore.push(imdbID)
        database.ref().child(folder + res.title).update({
          imdbID : imdbID,
          title: res.title
        })
      })
    }
  })
}
// fetch movie posters using imdb id for accuracy
function imdbPoster(){
  for (var i = 0; i < idStore.length; i++){
    var imdbID = idStore[i];
    $.ajax({
      url : "https://omdbapi.com/?apikey=40e9cece&i=" + imdbID,
      // url : "https://omdbapi.com/?apikey=40e9cece&t=" + name,
      method : "GET"
    }).done(function(results){
      var posterURL = results.Poster;
      var newTitle = results.Title;
      database.ref().child("nowPlaying/" + newTitle).update({
        poster : posterURL,
      })
    })
  }
}

// pull information from firebase to create display
function nowPlaying(snap, prevChildKey){
  console.log("run")
  // idStore = "";
  // movieTitle = "";
  var movieDisplay = $('<tr>');
  // create image data for table
  // console.log(snap.val().title)
  var moviePoster = $('<img>').attr('src', snap.val().poster);
  moviePoster.addClass('img img-responsive');
  var displayPoster = $('<td>').append(moviePoster);

  var titleDisplay = $('<td>').append(snap.val().title);

  movieDisplay.append(displayPoster, titleDisplay);
  $('#movie-schedule').prepend(movieDisplay);
}

function existingDatabase(snapshot){
  snapshot.forEach(function(childSnapshot){
    // idStore = "";
    // movieTitle = "";
    var movieDisplay = $('<tr>');
    // create image data for table
    // console.log(snap.val().title)
    var moviePoster = $('<img>').attr('src', childSnapshot.val().poster);
    moviePoster.addClass('img img-responsive');
    var displayPoster = $('<td>').append(moviePoster);

    var titleDisplay = $('<td>').append(childSnapshot.val().title);

    movieDisplay.append(displayPoster, titleDisplay);
    $('#movie-schedule').append(movieDisplay);
  })
}