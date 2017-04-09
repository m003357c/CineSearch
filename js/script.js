$(document).ready(function(){	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
			console.log('Service worker registered successfully');
		}).catch(function(err) {
			console.log('Service worker registration failed: ', err);
		});
	}
	let map;
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
		var userLoc = new google.maps.LatLng(latitude, longitude); 
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
		//create marker
		/*var marker = new google.maps.Marker({
			position: userLoc,
			title: "stoke position",
			map: map

		});*/
	};
	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};
	navigator.geolocation.getCurrentPosition(success, error, options);
	window.addEventListener('load', success );

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
			google.maps.event.trigger(map, "resize");
		}, 1000);
		
	});
	
});




















