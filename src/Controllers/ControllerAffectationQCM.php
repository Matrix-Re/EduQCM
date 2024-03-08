<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerAffectationQCM extends Controller{

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

     // Fait une action et retoune une réponse
     private static function ActionJQuery(){
          
     }

     // Fait une action et recharge la page
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