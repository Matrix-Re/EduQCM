<?php

require_once './Views/View.php';
class GestionDesComptes extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Gestion des Comptes</h2><?php
          
          require "./Views/Champs/Tableau/ListCompte.php";

          View::GenerateButton("Ajouter un utilisateur","btn btn-primary","GestionDesComptes/Compte");
     }
}
