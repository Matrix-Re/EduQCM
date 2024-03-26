<?php

require_once './Views/View.php';

/**
 * Class TableauDeBord
 *
 * This class is used to display the dashboard in the application.
 */
class TableauDeBord extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the dashboard display.
     */
     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Tableau de bord</h2><?php
           
          require "./Views/Champs/Tableau/ListQCM.php";
     }
}
