<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';

/**
 * Class ControllerAffectationQCM
 *
 * This class is used to manage views and popups in the application.
 */
class ControllerAffectationQCM extends Controller{

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
               // On inclut les models
               require './Models/ModelElève.php';
               require './Models/ModelEnseignant.php';
               require './Models/ModelQCM.php';

               // On execute les actions
               $this->Action();      
               
               // On récupère les données
               $ListUtilisateur = array_merge(ListEnseignant(),ListElève());
               $ListQCM = ListQCM();

               // On compact les données
               $Data = compact("ListUtilisateur","ListQCM");

               // On appelle la vue
               $this->Render('AffectationQCM','Accueil',$Data);
          }else {
               $this->ActionJQuery();
          }
     }

    /**
     * Executes jQuery actions.
     */
     private static function ActionJQuery(){
          
     }

    /**
     * Executes an action and reloads the page.
     *
     * Depending on the POST variables, it either logs out the user or validates the QCM assignment.
     */
     private static function Action(){
          // Action
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }
          if (isset($_POST['AffectationQCMValider'])) {
               if (!empty($_POST['ComboBoxIdQCM']) && !empty($_POST['AffectationQCMDate']) && !empty($_POST['AffectationQCMIdUtilisateur'])) {
                    $qcm = new QCM($_POST['ComboBoxIdQCM']);
                    $qcm->AffectationQCM();
               }
               else {
                    self::Message("Erreur","Veuillez remplir tout les champs");
               }
          }
     }

}