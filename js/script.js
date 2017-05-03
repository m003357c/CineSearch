if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
		console.log('Service worker registered successfully');
	}).catch(function(err) {
		console.log('Service worker registration failed: ', err);
	});
}
let map;
const markersArray = []; 
let marker;
let options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};
function initMap() {	
	if (document.getElementById( 'cineMap' ) === null) {
		return false;
	}  
	var defaultLoc = {lat: 53.010596, lng: -2.179887};
	map = new google.maps.Map(document.getElementById('cineMap' ),{
		zoom: 12,  
		center: defaultLoc,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false,
		draggable: true
	});
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(pos);		  
		});
	}
}

const boxOfficeContainer = document.getElementById('boxOffice');
if(boxOfficeContainer){
    fetch("js/films.json")
        .then(response => {
            return response.json();
        }).then(films => {
            const filmOutput = films.map(film => {
                return `<a href="#mapHolder" class="film-option"><figure role="group">
			  <img src="${film.picture}" alt="${film.name} Movie Poster">
			  <figcaption>${film.name}</figcaption>
			  </figure></a>`;
            }).join("\n");            
            boxOfficeContainer.innerHTML = filmOutput;
        });
}

$(document).ready(function(){		
	//search functionality and get markers from cinemas.json
	function showMap(){
		$("#boxOffice").hide();
		$("#mapHolder, .container").addClass("tallMap");
		$("#searchBox").addClass("absoluteSearch");
		setTimeout(function(){			
			$(".top-bar li img").addClass("is-showing");

			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);

			var request = new XMLHttpRequest();
			request.open('GET', 'js/cinemas.json', true);

			request.onload = function() {
				var infoWindow = new google.maps.InfoWindow({
							content: ''
						 });
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var data = JSON.parse(request.responseText);
					for (var i = 0; i < data.length; i++) {
						(function (cinema) {
							marker = new google.maps.Marker({
								position: new google.maps.LatLng(cinema.latitude,cinema.longitude),
								map: map,
								icon: "assets/images/cinesearch-map-icon.png",
								visible: true
							});
							//register for click events on info window
							google.maps.event.addListener(marker, 'click', function() { 
								infoWindow.setContent('<h1>' + cinema.name +'</h1>'+
										      '<p><span class="cineLoc">' + cinema.location +'</span><em> ' + cinema.address + '</em></p>' +
										      '<a href="#" class="btn viewing-times-link">Viewing Times</a>');
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
	
	
	$("body").on("click","a.viewing-times-link",function() {
		$("#filmTimes").show();
		
		var venuName = $(this).parent().children("h1").text();
		var venuLocation = $(this).parent().children("p").children("span").text();
		$(".film-times-inner h2").html(venuName + "<br> <small>" + venuLocation + "</small>");
		
		var request = new XMLHttpRequest();
		request.open('GET', 'js/films.json', true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				var data = JSON.parse(request.responseText);
				for (var i = 0; i < data.length; i++) {
					(function (film) {
						//output film times to page
						var filmTimes = '<div class="film-list-land">' +
									  '<div class="film-out">' +
										  '<div class="film-thumb">' +
											'<img src="' + film.picture + '" alt="' + film.name + ' Movie Poster"/>' +
										  '</div>' +
										  '<div class="film-times">' +
											'<h5>' + film.name + '</h5>' +
											'<p><a href="#" class="date-controls active">Today</a><a href="#" class="date-controls">17/04/17</a><a href="#" class="date-controls">18/04/17</a></p>' +
											'<table>' +
												'<tr>' +
													'<th>3D</th>' +
													'<td>' + film.times.td[0] + '</td>' +
													'<td>' + film.times.td[1] + '</td>' +
													'<td>' + film.times.td[2] + '</td>' +
													'<td>' + film.times.td[3] + '</td>' +
													'<td>' + film.times.td[4] + '</td>' +
												'</tr>' +
												'<tr>' +
													'<th>Standard</th>' +
													'<td>' + film.times.standard[0] + '</td>' +
													'<td>' + film.times.standard[1] + '</td>' +
													'<td>' + film.times.standard[2] + '</td>' +
													'<td>' + film.times.standard[3] + '</td>' +
													'<td>' + film.times.standard[4] + '</td>' +
												'</tr>' +
											'</table>' +
										  '</div>' +
									  '</div>' +
								  '</div>' +
								  '<div class="film-list-port">' +
									  '<div class="film-out">' +
										  '<div class="film-thumb">' +
											'<img src="' + film.picture + '" alt="' + film.name + ' Movie Poster"/>' +
										  '</div>' +
										  '<div class="film-times">' +
											'<h5>' + film.name + '</h5>' +
											'<p><a href="#" class="btn date-change">&lt;</a>Today<a href="#" class="btn date-change">&gt;</a></p>' +
											'<ul>' +
												'<li class="dropdown">' +
													'<a href="#">3D</a>' +
													'<ul class="dropdown-menu">' +
														'<li>' + film.times.td[0] + '</li>' +
														'<li>' + film.times.td[1] + '</li>' +
														'<li>' + film.times.td[2] + '</li>' +
													'</ul>' +
												'</li>' +
												'<li class="dropdown">' +
													'<a href="#">Standard</a>' +
													'<ul class="dropdown-menu">' +
														'<li>' + film.times.standard[0] + '</li>' +
														'<li>' + film.times.standard[1] + '</li>' +
														'<li>' + film.times.standard[2] + '</li>' +
														'<li>' + film.times.standard[3] + '</li>' +
														'<li>' + film.times.standard[4] + '</li>' +
													'</ul>' +
												'</li>' +
											'</ul>' +
										  '</div>' +
									  '</div>' +
								  '</div>';
						
						$(".film-times-inner").append(filmTimes);
						$(".film-list-land td:contains('undefined')").empty();
						$(".film-list-port .dropdown-menu li:contains('undefined')").remove();
					})(data[i]);
				}			  
			} else {			    
				console.log("Error returned");
			}
		};
		request.onerror = function() {
			console.log("Complete Error");
		};
		request.send();
	});
	
	$("body").on("click","span.btn-close",function() {
		$("#filmTimes").hide();
		$(".film-times-inner").empty();
	});
	$("body").on("click","li.dropdown a",function() {
		if($(this).parent().hasClass("open")){
			$(this).parent().removeClass("open");
		} else{
			$(this).parent().addClass("open");
		}
	});
	$("body").on("click",".dropdown-menu li",function() {
		var thisTime = $(this).text();
		$(this).parent().parent().toggleClass("open active").children("a").text(thisTime);
	});
	$("body").on("click","a.date-controls",function() {
		$(".date-controls.active").removeClass("active");
		$(this).addClass("active");
	});
});
