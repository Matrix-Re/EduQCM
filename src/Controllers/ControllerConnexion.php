<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerConnexion extends Controller{

     public function __construct()
     {
          session_start();
          
          if (!isset($_POST['ActionAjax'])) {
               $this->Action();
               $IsConnected = false;

               if (!empty($_SESSION["Connexion"])) {
                    if (!empty($_SESSION["Connexion"]->__get("ID_User"))) {
                         $IsConnected = true;
                    }
               }

               if ($IsConnected) {
                    $this->Render('SuccessLogin','Connexion');
               }else {
                    $this->Render('Login','Connexion');
               }
               
          }else {
               $this->ActionJQuery();
          }
     }

     // Fait une action et retoune une réponse
     private static function ActionJQuery(){
          // Action en Ajax
     }

     // Fait une action et recharge la page
     private static function Action(){
          // Action      
          if (isset($_POST['Login']) && isset($_POST['Password'])) {
               $_SESSION['Connexion'] = new ModelConnexion();
               $_SESSION['Connexion']->Login($_POST['Login'],$_POST['Password']);
          }
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }
     }

}