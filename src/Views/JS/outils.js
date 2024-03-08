// On attend que le document soit charger
$(document).ready(function () {

    /////////////////////////////////////
    //       VARIABLE DE GLOBAL        //
    /////////////////////////////////////
  
    /////////////////////////////////////
    //       FONCTION DE GENERAL       //
    /////////////////////////////////////
  
    // Permet de supprimer l'élément modal du document
    $(document).on("click", "#ClosePopup", function () {
      AjaxDisponible = true;
      $("#modal").remove()
    });    
    
});

// fonction utilisé pour le chronomètre
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