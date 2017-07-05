
var latitude = 37.7927728;
var longitude = -122.409847;

var markers =[];
var service ="";
var infoWindow ;
var hostnameRegexp = new RegExp('^https?://.+?/');

	///-- Find current coords
	//getLocation();

	function getLocation() {
	  	
		  	//if the Browser does not supports.
		  	if(!navigator.geolocation){
		  		document.getElementById("location").innerHTML="Geolocation is not supported by this browser.";
		  		return;	
		  	}

		  	function success(position){
		  		latitude = position.coords.latitude;
		  		longitude = position.coords.longitude;
		  		console.log("Lat -"+latitude+"--Long--"+longitude);
		  		//once coords created. Google initMap called

		  		initMap();
		  	}
	  	
		  	function error(){
		  		document.getElementById("location").innerHTML="Unable to retrieve your location";
		  	}

	  		navigator.geolocation.getCurrentPosition(success, error);
	}

	//Google Map Function

	function initMap() {
			
			//map position
			var center = {lat:latitude, lng:longitude};

			//create infor window for later use
			infoWindow = new google.maps.InfoWindow({
	          content: document.getElementById('info-content')
	        });

			//create map object
		    var map = new google.maps.Map(document.getElementById('location'), {
		      center: center,
		      zoom: 12,
		      
		    });
		    
		    var request = {
		    	location:center,
		    	radius :5000,
		    	types:['movie_theater']
		    };

		    //find nearby places
		    service = new google.maps.places.PlacesService(map);
		    service.nearbySearch(request,callback);

		    
		    function callback(results, status) {
		        if (status === google.maps.places.PlacesServiceStatus.OK) {
		        		console.log("No of results -->"+results.length);

		              for (var i = 0; i < results.length; i++) {
		                
			                // Use marker animation to drop the icons incrementally on the map.
			                markers[i] = new google.maps.Marker({
			                  position: results[i].geometry.location,
			                  animation: google.maps.Animation.DROP,
			                  icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/movies.png'
			                });

			                markers[i].placeResult = results[i];

			                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
			                setTimeout(dropMarker(i), i * 200);

		              } // End for loop
		        } //-- End if
		    }// End function callback



		    // function createMarker(place) {
		    // 	console.log( "No of times ");
			   //  var placeLoc = place.geometry.location;
			   //  var marker = new google.maps.Marker({
			   //      map: map,
			   //  	//position: place.geometry.location

			   //  	place: {
			   //  	        placeId:place.place_id,
			   //  	        location:place.geometry.location
			   //  	      },

			   //  	icon:'https://maps.gstatic.com/mapfiles/ms2/micons/movies.png',
			   //  	animation: google.maps.Animation.DROP
			   //    });

			   //  google.maps.event.addListener(marker, 'click', function() {
			   //    infowindow.setContent(place.name);
			   //    infowindow.open(map, this);
			   //  });


		    //  }

		    //set time out function to delay displaying markers
		    function dropMarker(i) {
		       return function() {
		         markers[i].setMap(map);
		       };
		     }

		      // Get the place details for a theatewr. Show the information in an info window,
		      function showInfoWindow() {
		        var marker = this;
		        service.getDetails({placeId: marker.placeResult.place_id},
		            function(place, status) {
		              if (status !== google.maps.places.PlacesServiceStatus.OK) {
		                return;
		              }
		              infoWindow.open(map, marker);
		              buildIWContent(place);
		            });
		      }


	}// --- initMap()end 

	// Load the place information into the HTML elements used by the info window.
	function buildIWContent(place) {
		console.log(place.name);
		document.getElementById('iw-icon').innerHTML = '<img class="placeIcon" ' +
		      'src="' + place.icon + '"/>';
		  document.getElementById('iw-url').innerHTML = '<b><a href="https://www.google.com/#q=' +place.name+
		      '" target="_blank">' + place.name + '</a></b>';
		  document.getElementById('iw-address').textContent = place.vicinity;

		  if (place.formatted_phone_number) {
		    document.getElementById('iw-phone-row').style.display = '';
		    document.getElementById('iw-phone').textContent =
		        place.formatted_phone_number;
		  } else {
		    document.getElementById('iw-phone-row').style.display = 'none';
		  }

		  // Assign a five-star rating , using a black star ('&#10029;')
		  // to indicate the rating place has earned, and a white star ('&#10025;')
		  // for the rating points not achieved.
		  if (place.rating) {
		    var ratingHtml = '';
		    for (var i = 0; i < 5; i++) {
		      if (place.rating < (i + 0.5)) {
		        ratingHtml += '&#10025;';
		      } else {
		        ratingHtml += '&#10029;';
		      }
		    document.getElementById('iw-rating-row').style.display = '';
		    document.getElementById('iw-rating').innerHTML = ratingHtml;
		    }
		  } else {
		    document.getElementById('iw-rating-row').style.display = 'none';
		  }

		  // The regexp isolates the first part of the URL (domain plus subdomain)
		  // to give a short URL for displaying in the info window.
		  if (place.website) {
		    var fullUrl = place.website;
		    var website = hostnameRegexp.exec(place.website);
		    if (website === null) {
		      website = 'http://' + place.website + '/';
		      fullUrl = website;
		    }
		    document.getElementById('iw-website-row').style.display = '';
		    document.getElementById('iw-website').textContent = website;
		  } else {
		    document.getElementById('iw-website-row').style.display = 'none';
		  }
	} // -- end buildIWContent

	/* Get iframe src attribute value i.e. YouTube video url
    and store it in a variable */
    // var url = $("#movietrailer").attr('src');
    

	//load google map when page load complete
	google.maps.event.addDomListener(window,'load',initMap());

	/* Modal Box for movie trailer Starts --*/

	$(document).on("click",".img-thumbnail", function() {
		console.log("You click me");

		//get assign movie id
		var mID = $(this).attr("movie-id");

		console.log("Movie Id -->"+mID);

		$("#movieTrailerModal").on('show.bs.modal', function(){
			// 	debugger;

			//Build Youtube URL for movie trailer
			var url = "https://www.youtube.com/embed/"+mID;
			$("#movietrailer").attr('src', url);

			console.log("Iframe  -->"+$("#movietrailer"));
		});

		$('#movieTrailerModal').modal('show');

	});


	/* Assign empty url value to the iframe src attribute when
	modal hide, which stop the video playing */
	$("#movieTrailerModal").on('hide.bs.modal', function(){
		console.log("You click close me");

	    $("#movietrailer").attr('src', '');
	
	});

	/* Modal Box for movie trailer End  --*/
