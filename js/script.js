let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const output = document.getElementById("myLocation");

function success(pos) {
	
	let latitude  = pos.coords.latitude;
                        let longitude = pos.coords.longitude;
	let accuracy = pos.coords.accuracy;

    output.innerHTML = `Latitude is ${latitude} and Longitude is ${longitude}. More or less ${accuracy} metres.`;

    const img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);

};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

navigator.geolocation.getCurrentPosition(success, error, options);


window.addEventListener('load', displayMap );
function displayMap() {
	if (document.getElementById( 'cineMap' ) === null) {
		return false;
	} 
	//latitude and longitude for Mellor building  
	var stoke = new google.maps.LatLng(53.010380, -2.180229); 
	//set up mapOptions (Zoom = 0 - zoomed out)  
	var mapOptions = {   
		zoom: 12,  
		center: stoke  
	};    
	//create map using mapOptions 
	var map = new google.maps.Map(document.getElementById('cineMap' ), mapOptions);
	
	//create marker
	var marker = new google.maps.Marker({
		position: stoke,
		title: "stoke position",
		map: map
	});
}
















