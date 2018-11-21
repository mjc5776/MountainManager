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

