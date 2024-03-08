<?php

require_once './Views/View.php';
class DetailsCompte extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Détails Comptes</h2><?php
               
          require "./Views/Champs/Formulaire/FormUtilisateur.php";
     }
}
