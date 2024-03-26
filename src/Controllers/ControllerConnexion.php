<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';

/**
 * Class ControllerConnexion
 *
 * This class is used to manage user connections in the application.
 */
class ControllerConnexion extends Controller{

    /**
     * Constructor of the class.
     *
     * Starts the session and checks if the user is connected.
     * Depending on the 'ActionAjax' POST variable, it either executes actions and renders a view,
     * or it executes jQuery actions.
     */
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

     /**
     * Executes jQuery actions.
     */
     private static function ActionJQuery(){
          // Action en Ajax
     }

    /**
     * Executes an action and reloads the page.
     *
     * Depending on the POST variables, it either logs in or logs out the user.
     */
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