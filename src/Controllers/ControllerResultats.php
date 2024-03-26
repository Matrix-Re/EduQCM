<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';

/**
 * Class ControllerResultats
 *
 * This class is used to manage the results in the application.
 */
class ControllerResultats extends Controller{

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
               // On execute les actions
               $this->Action();      
               
               // On récupère les données
               $ListRésultat = Model::ExecuteQuery("SELECT utilisateur.IdUtilisateur, Nom, Prénom, MoyenneQCM, COUNT(*) AS Disponible, NbQCMRéalisés
                    FROM utilisateur, résultat, elève
                    WHERE utilisateur.IdUtilisateur = résultat.IdUtilisateur AND utilisateur.IdUtilisateur = elève.IdUtilisateur GROUP BY utilisateur.IdUtilisateur, Nom, Prénom, MoyenneQCM, NbQCMRéalisés");          

               // On compact les données
               $Data = compact("ListRésultat");

               // On appelle la vue
               $this->Render('ResultatsElève','Résultats',$Data);
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
     * Depending on the POST variables, it either logs out the user or manages the results.
     */
     private static function Action(){
          // Action
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }          
     }

}