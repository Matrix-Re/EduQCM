<?php

require_once './Views/View.php';
class RealisationQCM extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";
           
          require "./Views/Champs/Information/InfoQCM.php";

          if ($NuméroQuestion != 0 && $Question->getTempsQuestion() == 0) {
               self::GenerateButton("Précédent","","","QuestionPrécédente","QuestionPrécédente");
          }

          if ($Question->getTempsQuestion() != 0) {
               ?>               
               <b><label id="timer" class="text-danger"></label></b>
               <?php
               echo "<script>startTimer(".$Question->getTempsQuestion().")</script>";
          }
          
          ?>
          <label class="text-danger">Question N°<?= $NuméroQuestion + 1 ?>/<?= $NbQuestion ?></label>
          <b><?= $Question->getLibelléQuestion() ?></b>
          <form method="post">
               <?php

               foreach ($Question->getListProposition() as $Proposition) { 
                    $checked = "";
                    if (in_array($Proposition->getIdProposition(),$PropositionSelectionner)) {
                         $checked = "checked";
                    }             
               ?>
                    <div>
                         <input type="checkbox" class="form-check-input" value="<?= $Proposition->getIdProposition() ?>" name="Proposition[]" <?= $checked ?>>
                         <label class="text-primary"><?= $Proposition->getLibelléProposition() ?></label>
                    </div>
               <?php          
               }
               self::GenerateButton("Valider","btn btn-primary","","QuestionSuivante","QuestionSuivante");
               ?>
          </form>
          
          <?php 
     }
}
