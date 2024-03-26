<?php

require_once './Views/View.php';

/**
 * Class AfficherQCM
 *
 * This class is used to display the QCM in the application.
 */
class AfficherQCM extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the QCM display.
     */
     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Affichage d'un QCM</h2>
          <form method="post">
          <?php
          
          require "./Views/Champs/ComboBox/ComboListQCM.php";

          self::GenerateButton("Afficher","btn btn-primary","","AfficherQCMValider","AfficherQCMValider");

          ?></form><?php

          if (!empty($QCM)) {
               require "./Views/Champs/Information/InfoQCM.php";
               require "./Views/Champs/Tableau/ListQuestionQCM.php";
          }
     }
}
