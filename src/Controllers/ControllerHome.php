<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerHome extends Controller
{

     public function __construct()
     {
          require_once './Models/ModelRéponse.php';
          session_start();
          IsConnected();

          if (!isset($_POST['ActionAjax'])) {
               // On execute les actions
               $this->Action();

               // On vérifie quel type d'utilisateur c'est connecté
               if ($_SESSION['Connexion']->__get("TypeUser") == "Enseignant") {
                    // On appelle la vue
                    $this->Render('Home', 'Résultats');
               } else {

                    if (empty($_SESSION['RéalisationEnCour'])) {
                         if (isset($_POST['AfficherQCM'])) {
                              // On inclut les models
                              require_once './Models/ModelResultat.php';
                              require_once './Models/ModelQCM.php';

                              // On compact les données
                              $Resultat = new Résultat($_POST['AfficherQCM']);
                              $QCM = new QCM($Resultat->getIdQCM());

                              $Data = compact("QCM", "Resultat");

                              // On appelle la vue
                              $this->Render('Resultats', 'Résultats',$Data);

                         } else {
                              // On récupère les données
                              $ListQCM = Model::ExecuteQuery("SELECT DISTINCT qcm.IdQCM, Description, LibelléQCM, DateAffectation, Note, DateRéalisation, IdRésultat
                              FROM qcm, thème, résultat
                              WHERE qcm.IdThème = thème.IdThème
                              AND qcm.IdQCM = résultat.IdQCM
                              AND résultat.IdUtilisateur = " . $_SESSION['Connexion']->__get("ID_User"));

                              // On compact les données
                              $Data = compact("ListQCM");

                              // On appelle la vue
                              $this->Render('TableauDeBord', 'Résultats', $Data);
                         }
                    } else {
                         // On inclut les models
                         require_once './Models/ModelResultat.php';
                         require_once './Models/ModelQCM.php';

                         $Resultat = new Résultat($_SESSION['IdRésultat']);

                         global $PropositionSelectionner;
                         if (empty($PropositionSelectionner)) {
                              $PropositionSelectionner = [];
                         }

                         $NuméroQuestion = $_SESSION['NuméroQuestion'];

                         // Si on arrive à la dernière question
                         if ($NuméroQuestion == $_SESSION['NbQuestion']) {
                              // On vérifie s'il y à au mois une réponse saisie
                              if (!empty($_SESSION['ListReponse'])) {
                                   foreach ($_SESSION['ListReponse'] as $reponse) {
                                        $reponse->Enregistrer();
                                   }
                              }
                              $Resultat->Enregistrer();

                              // On récupère les données
                              $Resultat = new Résultat($_SESSION['IdRésultat']);
                              $QCM = new QCM($Resultat->getIdQCM());      

                              $_SESSION['RéalisationEnCour'] = null;
                              $_SESSION['IdRésultat'] = null;
                              $_SESSION['NuméroQuestion'] = null;
                              $_SESSION['ListReponse'] = null;
                              $_SESSION['NbQuestion'] = null;

                              // On compact les données                             
                              $Data = compact("QCM", "Resultat");

                              // On appelle la vue
                              $this->Render('Resultats', 'Résultats',$Data);                              
                         } else {
                              $QCM = new QCM($Resultat->getIdQCM());
                              $QCM->getQuestion();
                              $_SESSION['NbQuestion'] = $QCM->NbQuestion();

                              $Question = $QCM->getListQuestion()[$NuméroQuestion];

                              // On compact les données
                              $Data = compact("QCM", "Question", "NuméroQuestion", "PropositionSelectionner");

                              // On appelle la vue
                              $this->Render('RealisationQCM', 'Résultats', $Data);
                         }
                    }
               }
          } else {
               $this->ActionJQuery();
          }
     }

     // Fait une action et retoune une réponse
     private static function ActionJQuery()
     {
     }

     // Fait une action et recharge la page
     private static function Action()
     {
          // Action
          if (isset($_POST['Déconnexion'])) {
               $_SESSION['Connexion']->Logout();
          }
          if (isset($_POST['RéaliserQCM'])) {
               $_SESSION['ListReponse'] = [];
               $_SESSION['RéalisationEnCour'] = true;
               $_SESSION['IdRésultat'] = $_POST['RéaliserQCM'];
               $_SESSION['NuméroQuestion'] = 0;
               $_SESSION['NbQuestion'] = 1;
          }
          if (isset($_POST['QuestionSuivante'])) {

               if (!empty($_POST['Proposition'])) {
                    foreach ($_POST['Proposition'] as $reponse) {
                         $Reponse = new Réponse($_SESSION['IdRésultat'], $reponse);
                         array_push($_SESSION['ListReponse'], $Reponse);
                    }
               }

               $_SESSION['NuméroQuestion']++;
          }
          if (isset($_POST['QuestionPrécédente'])) {
               global $PropositionSelectionner;
               $PropositionSelectionner = [];
               // On inclut les models
               require_once './Models/ModelResultat.php';
               require_once './Models/ModelQCM.php';

               if ($_SESSION['NuméroQuestion'] > 0) {
                    $_SESSION['NuméroQuestion']--;                    
               }
               $NuméroQuestion = $_SESSION['NuméroQuestion'];

               $Resultat = new Résultat($_SESSION['IdRésultat']);
               $QCM = new QCM($Resultat->getIdQCM());
               $QCM->getQuestion();

               $Question = $QCM->getListQuestion()[$NuméroQuestion];

               $index = 0;
               foreach ($_SESSION['ListReponse'] as $reponse) {

                    foreach ($Question->getListProposition() as $proposition) {                      
                         if ($reponse->getIdProposition() == $proposition->getIdProposition()) {
                              array_push($PropositionSelectionner, $reponse->getIdProposition());
                              array_splice($_SESSION['ListReponse'], $index, 1);
                              $index--;
                         }
                    }
                    $index++;
               }
          }
     }
}
