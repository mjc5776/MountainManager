//Wait to run until document is loaded
$(document).ready(function(){

//Hides table from view until user selects a mountain
$("#recentlyViewedTable").hide();

//When mountain is clicked: prevent default button action, show table, run add row function
$(".dropdown-item").on("click", function (e) {
    e.preventDefault();
    $("#recentlyViewedTable").show();
    $("#mountainSelector").click(addRow());
});

//Prepends new row to top of table with current view mountain info
function addRow() {
    $("tbody").prepend(mountainInfo);
};

//Am trying to create variables that pull data to fill table but havent figured it out yet
var mountainInfo = "<tr>" + 
    '<td>Mountain</td><td>14:15</td><td>Cold</td>' 
    + "</tr>";


})

