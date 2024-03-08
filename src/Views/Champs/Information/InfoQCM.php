<?php

$thème = new Thème($QCM->getIdThème());
$Description = $thème->getDescription();
$QCM->getQuestion();
$NbQuestion = $QCM->NbQuestion();

?>

<label>QCM N°<?= $QCM->getIdQCM() ?> :</label>
<label>Libellé : <?= $QCM->getLibelléQCM() ?></label>
<label>Thème : <?= $Description ?></label>
<label>Nombre de questions : <?= $NbQuestion ?></label>