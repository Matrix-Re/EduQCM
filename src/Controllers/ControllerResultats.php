<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerResultats extends Controller{

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

     // Fait une action et retoune une réponse
     private static function ActionJQuery(){
          
     }

     // Fait une action et recharge la page
     private static function Action(){
          // Action
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }          
     }

}