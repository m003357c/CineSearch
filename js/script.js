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
	var map = new google.maps.Map(document.getElementById('cineMap' ), mapOptions);
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

















