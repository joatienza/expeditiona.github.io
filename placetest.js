//IMPORTANT: This will probably be changed from a nearby search (with predetermined types) to text search (where you have more options)

var map;
var infowindow;
// creates new map centered at place1, displays it, and searches for types within radius of place1 (in this case, restaurants)
$(document).ready(function(){
    $("#FindPlaces").click(function(){
      // clears list of places at right of map
      // gets addresses from input boxes and formats them for url
      $("#placeList").empty();
      var $originraw = $('#origin').val();
      var $rad = $('#radius').val()*1609.34;
      var $originurl = $originraw.replace(/ /g, "+");
      var type = $("#locbtn select option:selected").val();

      // gets JSON data from url and stores in jtext
      $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+$originurl+'&key=AIzaSyA7OXa-HwyjlSJKa89x0yyXbxSn1EfTCEQ', function(jtext){
        // gets lat/long of origin and destination
        var orig = jtext.results[0].geometry.location

        // creates new map object
        map = new google.maps.Map(document.getElementById('map'), {
          center: orig,
          scrollwheel: true,
          zoom: 14
        });

        infowindow = new google.maps.InfoWindow();

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: orig,
          radius: $rad,
          types: [type]
        }, callback);

      });

      function callback(results, status) { 
        // if successful, place markers at found locations and add their names and addresses to element with id placeList
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            $('<p>'+results[i].name+', '+results[i].vicinity+'</p>').appendTo('#placeList');
          }
        }
      }
      
      // helper function to create marker
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: placeLoc
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
    });
});