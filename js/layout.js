$(document).ready(function() {
    $(".linediv").on("click", function() {
       $("#stack").slideToggle();
       console.log($("#stack").css('display'));
    });
});