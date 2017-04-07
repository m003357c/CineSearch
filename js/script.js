/*function initMap() {
    var stoke = {lat: 53.010274, lng: -2.178498};
    var map = new google.maps.Map(document.getElementById('cineMap'), {
        zoom: 13,
        center: stoke
    });
    var marker = new google.maps.Marker({
        position: stoke,
        map: map
    });
}*/
window.addEventListener('load', displayMap );
let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
const output = document.getElementById("myLocation");
function displayMap(pos) {
	
	let latitude  = pos.coords.latitude;
    let longitude = pos.coords.longitude;
	let accuracy = pos.coords.accuracy;

    if (document.getElementById( 'cineMap' ) === null) {
        return false; 
    } 
    //latitude and longitude for Mellor building 
    var userLoc = new google.maps.LatLng(${latitude}, ${longitude}); 
    //set up mapOptions (Zoom = 0 - zoomed out)
    var mapOptions = {
        zoom: 12, 
        center: userLoc 
    };     
    //create map using mapOptions 
    var map = new google.maps.Map(document.getElementById('cineMap'), mapOptions);
    
    var marker = new google.maps.Marker({
        position: userLoc,
        map: map
    });

};
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
navigator.geolocation.getCurrentPosition(displayMap, error, options);
