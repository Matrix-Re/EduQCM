<?php

require_once './Views/View.php';

/**
 * Class DetailsCompte
 *
 * This class is used to display the details of a user account in the application.
 */
class DetailsCompte extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the user account details.
     */
     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Détails Comptes</h2><?php
               
          require "./Views/Champs/Formulaire/FormUtilisateur.php";
     }
}
