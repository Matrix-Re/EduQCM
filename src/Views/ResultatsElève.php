<?php

require_once './Views/View.php';
class ResultatsElève extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Résultats par élève</h2><?php

          require "./Views/Champs/Tableau/ListResultats.php";
     }
}
