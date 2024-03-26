<?php

require_once './Views/View.php';

/**
 * Class GestionDesQCM
 *
 * This class is used to manage the QCM in the application.
 */
class GestionDesQCM extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the QCM management.
     */
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
