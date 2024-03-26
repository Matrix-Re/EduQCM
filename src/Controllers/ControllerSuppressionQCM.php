<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';

/**
 * Class ControllerSuppressionQCM
 *
 * This class is used to manage the deletion of QCMs in the application.
 */
class ControllerSuppressionQCM extends Controller{

     /**
     * Constructor of the class.
     *
     * Starts the session and checks if the user is connected and is a teacher.
     * Depending on the 'ActionAjax' POST variable, it either executes actions and renders a view,
     * or it executes jQuery actions.
     */
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

     /**
     * Executes jQuery actions.
     */
     private static function ActionJQuery(){
          // Action en Ajax
     }

     /**
     * Executes an action and reloads the page.
     *
     * Depending on the POST variables, it either logs out the user or manages the deletion of QCMs.
     */
     private static function Action(){
          // Action      
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }
     }

}