$(document).ready(function(){	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
			console.log('Service worker registered successfully');
		}).catch(function(err) {
			console.log('Service worker registration failed: ', err);
		});
	}
	let map;
	let userLoc;
	var markersArray = []; 
	var marker;
	var infoWindow = new google.maps.InfoWindow({
				content: ''
			 });
	
	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	function success(pos) {	
		if (document.getElementById( 'cineMap' ) === null) {
			return false;
		} 
		let latitude  = pos.coords.latitude;
		let longitude = pos.coords.longitude;

		//latitude and longitude for Mellor building  
		userLoc = new google.maps.LatLng(latitude, longitude); 
		//set up mapOptions (Zoom = 0 - zoomed out)  
		var mapOptions = {   
			zoom: 12,  
			center: userLoc,
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: false
		};    
		//create map using mapOptions 
		map = new google.maps.Map(document.getElementById('cineMap' ), mapOptions);
		map.setOptions({draggable: true});
		
	};
	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};
	navigator.geolocation.getCurrentPosition(success, error, options);
	window.addEventListener('load', success );
	
	//output films from films.json
	$.getJSON("js/films.json", function(data) {
		$.each( data, function( key, val ) {
			var filmOutput = `<a href="#mapHolder" class="film-option"><figure>
					  <img src="${val.picture}" alt="${val.name} Movie Poster">
					  <figcaption>${val.name}</figcaption>
					  </figure></a>`;
			$("#boxOffice").append(filmOutput);
		})
	});
	//hamburger navigation
	$('.hamburger').parent().click(function(){
		$("nav").addClass("is-showing");
		
	});	
	$("nav .close").click(function(){
		$("nav").removeClass("is-showing");
	});
	//search functionality and get markers from cinemas.json
	function showMap(){
		$("#boxOffice").hide();
		$("#mapHolder, .container").addClass("tallMap");
		$("#searchBox").addClass("absoluteSearch");
		setTimeout(function(){			
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
			
			var request = new XMLHttpRequest();
			request.open('GET', 'js/cinemas.json', true);

			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var data = JSON.parse(request.responseText);
					console.log(data.length);
					for (var i = 0; i < data.length; i++) {
						(function (cinema) {
							console.log(cinema.latitude,cinema.longitude);
							marker = new google.maps.Marker({
								position: new google.maps.LatLng(cinema.latitude,cinema.longitude),
								map: map,
								icon: "assets/images/cinesearch-map-icon.png",
								visible: true
							});
							//register for click events on info window
							google.maps.event.addListener(marker, 'click', function() { 
								infoWindow.setContent('<h1>' + cinema.name +'</h1>'+
										      '<p>' + cinema.location +'<em> ' + cinema.address + '</em></p>' +
										      '<a href="#" class="viewing-times-link">Viewing Times</a>');
								infoWindow.open(map, this);
							});
							markersArray.push(marker);
						})(data[i]);
					}			  
				} else {
				    // We reached our target server, but it returned an error
					console.log("Error returned");

				}
			};

			request.onerror = function() {
				// There was a connection error of some sort
				console.log("Complete Error");
			};
			request.send();
		}, 500);	
	}
	$("#searchBox .btn").click(showMap);
	$("body").on("click","a.search",showMap);
	
	//Change search box by searching by film
	$("body").on("click","a.film-option",function(e) {
		$("#searchBox .filmSearch").remove();	
		if($("a.film-search").hasClass("film-search")){
			$("a.film-search").removeClass("film-search")	
		}
		$(this).addClass("film-search");
		$("#searchBox form").hide();
		var filmName = $(this).children().children("figcaption").text();
		var filmSearchHTML = "<div class='filmSearch'>" +
					"<h2>Cinemas Showing<br><strong>'" + filmName + "'</strong></h2>" +
					"<p><a href='#' class='btn search'>Search</a><a href='#' class='btn cancel-search'>Cancel</a></p>" +
				     "</div>";
		$("#searchBox").append(filmSearchHTML);	
		
		e.preventDefault();
		var target = this.hash;
		$target = $(target);
		$('html, body').stop().animate({'scrollTop': $target.offset().top}, 900, 'swing', function(){
			window.location.hash = target;
		});
	});
	$("body").on("click","a.cancel-search",function() {
		$("a.film-search").removeClass("film-search");
		$("#searchBox form").show();
		$("#searchBox .filmSearch").remove();	
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});
