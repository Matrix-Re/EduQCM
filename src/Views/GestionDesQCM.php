<?php

require_once './Views/View.php';
class GestionDesQCM extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

          ?><h2>Gestion des QCM</h2><?php
          
          ?><div><?php
               self::GenerateButton("Afficher un QCM","btn btn-primary","GestionDesQCM/Afficher");
               self::GenerateButton("Ajouter un QCM","btn btn-danger",'/GestionDesQCM/Ajouter');
               self::GenerateButton("Modifier un QCM","btn btn-danger");
               self::GenerateButton("Supprimer un QCM","btn btn-primary","GestionDesQCM/Suppression");      
          ?></div><?php    
     }
}
