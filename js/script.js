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
	
	$.getJSON("js/films.json", function(data) {
		console.log(data);
		$.each( data, function( key, val ) {
			var filmOutput = `<figure>
					  <img src="${val.picture}" alt="${val.name} Movie Poster">
					  <figcaption>${val.name}</figcaption>
					  </figure>`;
			$("#boxOffice").append(filmOutput);
		})
	});
	/*const filmContainer = document.getElementById('boxOffice');
	if(filmContainer){
	    fetch("films.json").then(response => {
		    return response.json();
		}).then(films => {
			const filmsHTML = films.map(event => {
				return `<figure>
					  <img src="${films.picture}" alt="${films.name} Movie Poster">
					  <figcaption>${films.name}</figcaption>
					</figure>`;
			}).join("\n");

		    filmContainer.innerHTML = filmsHTML;
		});
	}*/
	
	
	
	
	$('.hamburger').parent().click(function(){
		$("nav").addClass("is-showing");
		
	});	
	$("nav .close").click(function(){
		$("nav").removeClass("is-showing");
	});
	$("#searchBox .btn").click(function(){
		$("#boxOffice").hide();
		$("#mapHolder, .container").addClass("tallMap");
		$("#searchBox").addClass("absoluteSearch");
		setTimeout(function(){			
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);

			function addMarker(lat,lng) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat,lng),
					map: map,
					icon: "assets/images/cinesearch-map-icon.png"
				});
				markersArray.push(marker);
			}
			$.getJSON("js/cinemas.json", function(data) {
				console.log(data);
				$.each( data, function( key, val ) {
					addMarker(val.latitude,val.longitude);
				})
			});
			
		}, 500);
		
	});
	
});
