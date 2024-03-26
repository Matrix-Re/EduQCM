<?php

require_once './Views/View.php';

/**
 * Class SuppressionQCM
 *
 * This class is used to manage the deletion of QCM in the application.
 */
class SuppressionQCM extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the QCM deletion.
     */
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
