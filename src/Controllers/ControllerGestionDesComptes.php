<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';

/**
 * Class ControllerGestionDesComptes
 *
 * This class is used to manage user accounts in the application.
 */
class ControllerGestionDesComptes extends Controller{

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
               
               // On execute les actions
               $this->Action();                 
               
               global $paramterUrl;
               if (!empty($paramterUrl) && $paramterUrl[0] == "Compte") {
                    $IdUtilisateur = 0;
                    if (!empty($paramterUrl[1])) {
                         $IdUtilisateur = $paramterUrl[1];
                    }

                    // On récupère les données
                    $Compte = new Utilisateur($IdUtilisateur);
                    if ($Compte->getNom() == "") {
                         $Compte = null;
                    }
                    
                    // On compact les données
                    $Data = compact("Compte");

                    // On appelle la vue
                    $this->Render('DetailsCompte','Compte',$Data);
               }
               else{
                    // On récupère les données
                    $ListCompte = array_merge(ListEnseignant(),ListElève());
                    
                    // On compact les données
                    $Data = compact("ListCompte");

                    // On appelle la vue
                    $this->Render('GestionDesComptes','Gestion des comptes',$Data);
               }               
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
     * Depending on the POST variables, it either logs out the user or manages user accounts.
     */
     private static function Action(){
          // Action
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }       
          if (isset($_POST['CréationCompte'])) {
               if (!empty($_POST['Nom']) && !empty($_POST['Prénom']) && !empty($_POST['Login']) && !empty($_POST['MotDePasse']) && !empty($_POST['Type'])) {
                    
                    $user = new $_POST['Type']();
                    $user->Nom = $_POST['Nom'];
                    $user->Prénom = $_POST['Prénom'];
                    $user->Login = $_POST['Login'];
                    $user->MotDePasse = $_POST['MotDePasse'];

                    $user->Enregistrer();
               }else {
                    self::Message("Erreur","Veuillez remplir tout les champs");
               }
               
          }
          if (isset($_POST['ModificationCompte'])) {
               if (!empty($_POST['Nom']) && !empty($_POST['Prénom']) && !empty($_POST['Login']) && !empty($_POST['MotDePasse']) && !empty($_POST['Type'])) {
                    
                    $user = new $_POST['Type']($_POST['ModificationCompte']);
                    $user->Nom = $_POST['Nom'];
                    $user->Prénom = $_POST['Prénom'];
                    $user->Login = $_POST['Login'];
                    $user->MotDePasse = $_POST['MotDePasse'];

                    $user->Enregistrer();
               }else {
                    self::Message("Erreur","Veuillez remplir tout les champs");
               }
          }
          if (isset($_POST['SuppressionCompte'])) {
               $user = new Utilisateur($_POST['SuppressionCompte']);
               $user->Supprimer();
          }
     }

}