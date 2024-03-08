<?php

require_once './Views/View.php';
class SuppressionQCM extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Suppression d'un QCM</h2>
          <form method="POST">
          <?php
          
          require "./Views/Champs/Tableau/ListQCMSuppression.php";

          View::GenerateButton("Supprimer", "btn btn-primary", "", "SuppressionQCMValider","SuppressionQCMValider");

          ?></form><?php
     }
}
