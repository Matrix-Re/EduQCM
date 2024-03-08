<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerSuppressionQCM extends Controller{

     public function __construct()
     {
          session_start();
          IsConnected();
          IsTeacher();
          
          if (!isset($_POST['ActionAjax'])) {
               $this->Action();
               $IsConnected = false;

               if (!empty($_SESSION["Connexion"])) {
                    if (!empty($_SESSION["Connexion"]->__get("ID_User"))) {
                         $IsConnected = true;
                    }
               }

            $this->Render('SuppressionQCM','Résultats');
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
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }
     }

}