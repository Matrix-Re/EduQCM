<?php

require_once './Views/View.php';

/**
 * Class ResultatsElève
 *
 * This class is used to display the results per student in the application.
 */
class ResultatsElève extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the results display per student.
     */
     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Résultats par élève</h2><?php

          require "./Views/Champs/Tableau/ListResultats.php";
     }
}
