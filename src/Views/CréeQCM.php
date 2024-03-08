<?php

require_once './Views/View.php';
class CréeQCM extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

?><h2>Création d'un QCM</h2>

          <?php if (empty($_SESSION['newQCM'])) { ?>
               <form method="post">

                    <input type="text" placeholder="Libellé QCM" name="LibelléQCM">
                    <?php require "./Views/Champs/ComboBox/ComboListThème.php"; ?>
                    <input type="number" placeholder="Nombre de question" name="NbQuestion">
                    <?php View::GenerateButton("Valider", "btn btn-primary", "", "ValiderDébutCréationQCM", "ValiderDébutCréationQCM")  ?>

               </form>
          <?php } else { ?>

               <form method="post">
                    <label>Question N°<?= $_SESSION['newQCM']->NbQuestion() + 1 ?></label><br>
                    <input type="text" placeholder="Libellé Question" name="LibelléQuestion">
                    <input type="number" placeholder="Temps question" name="TempsQuestion">
                    <br>

                    <?php for ($i = 0; $i < 4; $i++) { ?>
                         <input type="text" placeholder="Libellé Proposition N°<?= $i + 1 ?>" name="LibelléProposition[]">
                         <input type="number" min="0" max="1" placeholder="RésultatVraiFaux" name="RésultatVraiFaux[]">
                         <br>
                    <?php } ?>

                    <?php View::GenerateButton("Valider", "btn btn-primary", "", "ValiderQuestion", "ValiderQuestion")  ?>

               </form>

          <?php } ?>

<?php


     }
}
