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

var eventful = "http://api.eventful.com/json/events/search?" + "&app_key=TrvGWQVsBrMhNwnd"





// use scrollspy on results list

// $('body').scrollspy({ target: '#navbar-example' })