<?php

require_once './Views/View.php';

/**
 * Class GestionDesComptes
 *
 * This class is used to manage the user accounts in the application.
 */
class GestionDesComptes extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the user accounts management.
     */
     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Gestion des Comptes</h2><?php
          
          require "./Views/Champs/Tableau/ListCompte.php";

          View::GenerateButton("Ajouter un utilisateur","btn btn-primary","GestionDesComptes/Compte");
     }
}
