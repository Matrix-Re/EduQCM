<?php
$NuméroQuestion = 1;
foreach ($QCM->getListQuestion() as $Question) {
     
?>
     <label class="text-danger">Question N°<?= $NuméroQuestion ?>/<?= $NbQuestion ?></label>
     <b><?= $Question->getLibelléQuestion() ?></b>
     <?php

     foreach ($Question->getListProposition() as $Proposition) {
          $RésultatVraiFaux = "";
          if ($Proposition->getRésultatVraiFaux()) {
               $RésultatVraiFaux = "checked";
          }
     ?>
          <div>
               <input type="checkbox" class="form-check-input" disabled <?= $RésultatVraiFaux ?>>
               <label class="text-primary"><?= $Proposition->getLibelléProposition() ?></label>
          </div>
<?php
     }

     $NuméroQuestion++;
}

?>