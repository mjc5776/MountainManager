//Wait to run until document is loaded
// $(document).ready(function () {

  //Hides table from view until user selects a mountain
  $("#recentlyViewedTable").hide();
  $("#weatherCard").hide();
  $("#mapCard").hide();

  //When mountain is clicked: prevent default button action, show table, run add row function
  $(".dropdown-item").on("click", function (e) {
    e.preventDefault();

  });

  //Prepends new row to top of table with current view mountain info
  function addRow(temp, sky, resortName) {
    console.log('why');
    var mountainInfo = "<tr>" +
    '<td>' + resortName + '</td><td>14:15</td><td>' + temp + '&deg;F' + '  ' + sky + '</td>' +
    "</tr>";
    $("tbody").prepend(mountainInfo);
  };

  //Am trying to create variables that pull data to fill table but havent figured it out yet
 
  

  //Get Weather data from openweathermap api
  function getWeather(longitute, latitude, resortName) {
    initMap(longitute, latitude);
    var weatherKey = 'f62f99a69c9512347f2e5f3f3278d67f';
    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather";

    $.ajax({
        url: weatherQueryURL,
        method: "GET",
        data: {
          lon: longitute,
          lat: latitude,
          appid: weatherKey,
          units: 'imperial'
        }

      })
      .then(function (response) {
        $.each(response.weather, function () {
          console.log('fired');
          //api returns a weather array that may have more than one item. Return length to get latest weather in array
          var arrayLength = response.weather.length
          arrayLength--;
          var temp = Math.round(response.main.temp);
          var sky = response.weather[arrayLength].main;
          console.log(arrayLength);
          console.log(response);

          // Transfer content to HTML
          $("#temp").html("<img src=http://openweathermap.org/img/w/" + response.weather[0].icon + '.png>' + temp + '&deg;F');
          $("#wind").html("Wind Speed: " + response.wind.speed + ' mph');
          $("#sky").html("Sky: " + sky);
          addRow(temp, sky, resortName);
        });
      });
  };
  //Get Ski Report information from onthesnow api
  function getResortInfo(resortName) {
    var resortQueryURL = "https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids=251&language=en&pagetype=skireport&direction=+1"

    $.ajax({
        url: resortQueryURL,
        method: "GET",
      })
      .then(function (resortResponse) {
        $.each(resortResponse, function () {
          var text = resortName;
          var resortRow = jQuery.inArray("e", text);
          resortRow++;
          var liftsOpen = resortResponse.rows[resortRow].snowcone.lifts_open;
          var totalLifts = resortResponse.rows[resortRow].resortProfile.num_lifts;
          var baseDepth = resortResponse.rows[resortRow].snowcone.base_depth_cm;
          var runsOpen = resortResponse.rows[resortRow].snowcone.num_trails_slopes_open;
          var runs = resortResponse.rows[resortRow].resortProfile.number_runs;
          $("#lifts").html("Lifts Open: " + liftsOpen + ' of ' + totalLifts);
          $("#runs").html("Runs Open: " + runsOpen + ' of ' + runs);

          
          baseDepth = Math.round(parseInt(baseDepth) * 0.39370);
          $('#snowDepth').html("Snow Depth: " + baseDepth + "&#8243");
          $('#weather').html(resortName)
          console.log(resortResponse);
          // initMap();
        });
      })
  };

  var config = {
    apiKey: "AIzaSyCdTbgMzT0i15jjExftRLEW0dXqYYf0aG0",
    authDomain: "mountain-manager-3085e.firebaseapp.com",
    databaseURL: "https://mountain-manager-3085e.firebaseio.com",
    projectId: "mountain-manager-3085e",
    storageBucket: "mountain-manager-3085e.appspot.com",
    messagingSenderId: "571933742640"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  var resortDataArray = ["Arapahoe Basin Ski Area", "Aspen  Snowmass", "Beaver Creek", "Breckenridge", "Cooper",
    "Copper Mountain Resort", "Crested Butte Mountain Resort", "Echo Mountain", "Eldora Mountain Resort",
    "Howelsen Hill", "Keystone", "Loveland", "Monarch Mountain", "Powderhorn", "Purgatory",
    "Silverton Mountain", "Ski Granby Ranch", "Steamboat", "Sunlight Mountain Resort", "Telluride", "Vail",
    "Winter Park Resort", "Wolf Creek Ski Area"
  ];

  resortDataArray.forEach(resort => {
    var newButton = $("<button>");
    newButton.addClass("dropdown-item");
    newButton.attr("resort-value", resort);
    newButton.text(resort);
    $(".dropdown-menu").append(newButton);
  })

  $(".dropdown-item").on("click", function () {

    var resortName = $(this).attr("resort-value");
    console.log("name; " + resortName);
    $("#resort").html(resortName);

    database.ref("/Colorado resorts/").on("value", function (snapshot) {
      var shot = snapshot.val();
      //console.log(resortName + " zipcode: " + JSON.stringify(shot[resortName].zipcode));
      //console.log(resortName + " latitude: " + JSON.stringify(shot[resortName].latitude));
      //console.log(resortName + " longitude: " + JSON.stringify(shot[resortName].longitude));
      
      //removed the JSON.stringify because it was adding "" to the value returned.
      var longitude =  (shot[resortName].longitude)
      var latitude = (shot[resortName].latitude)
      myLng = (shot[resortName].longitude);
      myLat = (shot[resortName].latitude);
      console.log("myLat ...", myLat, latitude)
      // createMarker(myLng, myLat);
      
      $("#recentlyViewedTable").show();
      $("#weatherCard").show();
      $("#mapCard").show();
  
      //Runs Weather and Resort functions
      getWeather(longitude, latitude, resortName);
      getResortInfo(resortName);
      // console.log("invoke creatMArker")
      // createMarker(myLng, myLat);
      // initMap();
    })


  });

// })
 //  This block of code shows users location on google maps.
 var map, infoWindow;
 var myLng, myLat;
 function initMap(long, latt) {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: -34.397, lng: 150.644},
     zoom: 10
   });
   infoWindow = new google.maps.InfoWindow;

   // Try HTML5 geolocation.
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
       var pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };

       infoWindow.setPosition(pos);
       infoWindow.setContent('Location found.');
       infoWindow.open(map);
      //  map.setCenter(pos);
      
      
      console.log(long, latt);
      // createMarker(long, latt);
      console.log("string or number???", typeof long)
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: parseInt(latt),
          lng: parseInt(long)
        } 
      });
      marker.setMap(map);


     }, function() {
       console.log("browser is gucci for geoloc")
       handleLocationError(true, infoWindow, map.getCenter());
      //  createMarker(long, lat);
     });
   } else {
     // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, map.getCenter());
   }
 }

 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
   infoWindow.setPosition(pos);
   infoWindow.setContent(browserHasGeolocation ?
                         'Error: The Geolocation service failed.' :
                         'Error: Your browser doesn\'t support geolocation.');
   infoWindow.open(map);
 }


 function createMarker(long, latt) {
  console.log(long, latt)
  var marker = new google.maps.Marker({
      map: map,
      position: {
        lat: latt,
        lng: long
      } 
    });
    // map.setCenter(map)
  }