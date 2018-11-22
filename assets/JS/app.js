//Wait to run until document is loaded
$(document).ready(function(){
  

//Hides table from view until user selects a mountain
$("#recentlyViewedTable").hide();

//When mountain is clicked: prevent default button action, show table, run add row function
$(".dropdown-item").on("click", function (e) {
    e.preventDefault();
    $("#recentlyViewedTable").show();
    $("#mountainSelector").click(addRow());
    
    //Runs Weather and Resort functions
    getWeather();
    getResortInfo();
    
    
});

//Prepends new row to top of table with current view mountain info
function addRow() {
    $("tbody").prepend(mountainInfo);
};

//Am trying to create variables that pull data to fill table but havent figured it out yet
var mountainInfo = "<tr>" + 
    '<td>Mountain</td><td>14:15</td><td>Cold</td>' 
    + "</tr>";

//Get Weather data from openweathermap api
    function getWeather(){
        var weatherKey = 'f62f99a69c9512347f2e5f3f3278d67f';
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather";
        var zipCode = $("#txtZipCode").val();
        
      $.ajax({
          url: weatherQueryURL,
          method: "GET",
          data: {
            zip: zipCode,
            appid: weatherKey,
            units: 'imperial'
          }
  
        })
        .then(function (response) {
          $.each(response.weather, function () {
  
            //api returns a weather array that may have more than one item. Return length to get latest weather in array
            var arrayLength = response.weather.length
            arrayLength--;
            var temp = Math.round(response.main.temp);
            console.log(arrayLength);
            console.log(response);
            
            // Transfer content to HTML
            $("#temp").html("<img src=http://openweathermap.org/img/w/" + response.weather[0].icon + '.png>' + temp + '&deg;F');
            $("#wind").html("Wind Speed: " + response.wind.speed + ' mph');
            $("#sky").html("Sky: " + response.weather[arrayLength].main);
          });
        });
      };
    //Get Ski Report information form onthesnow api
      function getResortInfo(){
        var resortQueryURL = "https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids=251&language=en&pagetype=skireport&direction=+1"
        
        $.ajax({
          url: resortQueryURL,
          method: "GET",
        })
        .then(function (resortResponse) {
          $.each(resortResponse, function () {
          var text = "Breckenridge"; //Set to Breck until dropdown is working
          var resortRow = jQuery.inArray( "e", text );
          resortRow ++;
           var liftsOpen = resortResponse.rows[resortRow].snowcone.lifts_open;
           var totalLifts = resortResponse.rows[resortRow].resortProfile.num_lifts;
           var baseDepth = resortResponse.rows[resortRow].snowcone.base_depth_cm;
          $("#lifts").html("Lifts Open: " + liftsOpen +'/'+ totalLifts );
          baseDepth = Math.round(parseInt(baseDepth) * 0.39370);
          $('#snowDepth').html("Snow Depth: "+ baseDepth+"&#8243");
          });
        });
      };
})
// I don't know why this is not working in the js file.
// This is the begining of the Google maps section.


  // var x = document.getElementById("demo");
   
  //  function getLocation() {
      
  //      if (navigator.geolocation) {
  //          navigator.geolocation.watchPosition(showPosition);
  //      } else { 
  //          x.innerHTML = "Geolocation is not supported by this browser.";}
  //      }
   
  //  function showPosition(position) {
  //      x.innerHTML="Latitude: " + position.coords.latitude + 
  //      "<br>Longitude: " + position.coords.longitude;
  //      var currentPosition = position;
  //      console.log(position);
  //    };
        // var myCord = {lat: 39.7392, lng: -104.9903};
        // var mtnCord = {lat: 39.6403, lng: -106.3742};
        // function initMap(getLocation) {
        //   var bounds = new google.maps.LatLngBounds;
        //   var markersArray = [];
        // //  Starting point lat/lng
        //   var origin = myCord;
        // //  Destination lat/lng
        //   var destination = mtnCord;
        // //  generates icons
        //   var destinationIcon = "https://chart.googleapis.com/chart?" +
        //       "chst=d_map_pin_letter&chld=D|FF0000|000000";
        //   var originIcon = "https://chart.googleapis.com/chart?" +
        //       "chst=d_map_pin_letter&chld=O|FFFF00|000000";
        // // Center point lat/lng for map
        //   var map = new google.maps.Map(document.getElementById("map"), {
        //     center: {lat: 39.5501, lng: -105.7821},
        //     zoom: 10
        //   });
          
        //   // Shows the traffic on the map.
        //   var trafficLayer = new google.maps.TrafficLayer();
        //   trafficLayer.setMap(map);

        //   var geocoder = new google.maps.Geocoder;
  
        //   var service = new google.maps.DistanceMatrixService;
        //   service.getDistanceMatrix({
        //     origins: [origin],
        //     destinations: [destination],
        //     travelMode: "DRIVING",
        //     unitSystem: google.maps.UnitSystem.METRIC,
        //     avoidHighways: false,
        //     avoidTolls: false
        //   }, function(response, status) {
        //     if (status !== "OK") {
        //       alert("Error was: " + status);
        //     } else {
        //       var originList = response.originAddresses;
        //       var destinationList = response.destinationAddresses;
        //       var outputDiv = document.getElementById("output");
        //       outputDiv.innerHTML = "";
        //       deleteMarkers(markersArray);
  
        //       var showGeocodedAddressOnMap = function(asDestination) {
        //         var icon = asDestination ? destinationIcon : originIcon;
        //         return function(results, status) {
        //           if (status === "OK") {
        //             map.fitBounds(bounds.extend(results[0].geometry.location));
        //             markersArray.push(new google.maps.Marker({
        //               map: map,
        //               position: results[0].geometry.location,
        //               icon: icon
        //             }));
        //           } else {
        //             alert("Geocode was not successful due to: " + status);
        //           }
        //         };
        //       };
  
        //       for (var i = 0; i < originList.length; i++) {
        //         var results = response.rows[i].elements;
        //         geocoder.geocode({"address": originList[i]},
        //             showGeocodedAddressOnMap(false));
        //         for (var j = 0; j < results.length; j++) {
        //           geocoder.geocode({"address": destinationList[j]},
        //               showGeocodedAddressOnMap(true));
        //           outputDiv.innerHTML += originList[i] + " to " + destinationList[j] +
        //               ": " + results[j].distance.text + " in " +
        //               results[j].duration.text + "<br>";
        //         }
        //       }
        //     }
        //   });
        // }
  
        // function deleteMarkers(markersArray) {
        //   for (var i = 0; i < markersArray.length; i++) {
        //     markersArray[i].setMap(null);
        //   }
        //   markersArray = [];
        // }
        
        // src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHzWlw-oxprYIXqfQALfy0P7bUMFjmyoA&callback=initMap"
        
        
      
        
      
     
    
  
   
    
