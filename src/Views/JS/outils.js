$(document).ready(function () {

    /**
     * Removes the modal element from the document.
     */
    $(document).on("click", "#ClosePopup", function () {
      AjaxDisponible = true;
      $("#modal").remove()
    });    
    
});

/**
 * Starts a timer with the given number of seconds.
 *
 * @param {number} seconde - The number of seconds for the timer.
 */
function startTimer(seconde) {
  timerInterval = setInterval(function() {
    
    seconde--
    if (seconde <= 0) {
      clearInterval(timerInterval);
      $("#QuestionSuivante").click()
    }

    $("#timer").text("Tesmps restant : " + seconde)        
  }, 1000);
}