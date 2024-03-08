<?php

require_once './Views/View.php';
class TableauDeBord extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Tableau de bord</h2><?php
           
          require "./Views/Champs/Tableau/ListQCM.php";
     }
}
