
function initMap() {
  // The location of Uluru
  var uluru = {lat: 17.715141, lng: 105.155337};
  var centerPoint = {lat: 17.715095, lng: 105.165640}
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: centerPoint});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map, draggable: false, animation: google.maps.Animation.DROP });

}
//EVENTS
google.maps.event.addDomListener(window, 'load', initMap);
// initMap();
