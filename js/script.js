function initMap() {
    var stoke = {lat: 53.010274, lng: -2.178498};
    var map = new google.maps.Map(document.getElementById('cineMap'), {
        zoom: 13,
        center: stoke
    });
    var marker = new google.maps.Marker({
        position: stoke,
        map: map
    });
}
