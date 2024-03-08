<?php

require_once './Controllers/Controller.php';
require_once './Models/ModelConnexion.php';
class ControllerGestionDesQCM extends Controller
{

     public function __construct()
     {
          require_once './Models/ModelQCM.php';
          session_start();
          IsConnected();
          IsTeacher();

          if (!isset($_POST['ActionAjax'])) {
               // On execute les actions
               $this->Action();

               global $paramterUrl;
               if (!empty($paramterUrl[0])) {
                    switch ($paramterUrl[0]) {
                         case 'Afficher':
                              // On inclut les models                              

                              // On récupère les données
                              $ListQCM = ListQCM();

                              global $QCM;

                              // On compact les données
                              $Data = compact("ListQCM", "QCM");

                              $this->Render('AfficherQCM', 'Affichage QCM', $Data);
                              break;
                         case 'Ajouter':
                              // On inclut les models                              

                              // On récupère les données
                              $ListThème = ListThème();

                              // On compact les données
                              $Data = compact("ListThème");

                              $this->Render('CréeQCM', 'Crée QCM', $Data);
                              break;
                         case 'Suppression':
                              // On inclut les models                              

                              // On récupère les données
                              $ListQCM = ListQCM();

                              // On compact les données
                              $Data = compact("ListQCM");

                              $this->Render('SuppressionQCM', 'Gestion des QCM', $Data);
                              break;
                    }
               } else {
                    // On appelle la vue
                    $this->Render('GestionDesQCM', 'Gestion des QCM');
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
          if (isset($_POST['AfficherQCMValider'])) {
               global $QCM;
               $QCM = new QCM($_POST['ComboBoxIdQCM']);
               $QCM->getQuestion();
          }
          if (isset($_POST['SuppressionQCMValider'])) {
               if (!empty($_POST['SuppressionQCMIdQCM'])) {
                    foreach ($_POST['SuppressionQCMIdQCM'] as $IdQCM) {
                         $QCM = new QCM($IdQCM);
                         $QCM->Supprimer();
                    }
               } else {
                    self::Message("Erreur", "Vous devez selectionner des QCM pour les supprimer");
               }
          }

          if (isset($_POST['ValiderDébutCréationQCM'])) {
               if (isset($_POST['LibelléQCM']) && isset($_POST['ComboBoxIdThème']) && isset($_POST['NbQuestion'])) {

                    $_SESSION['newQCM'] = new QCM();

                    $_SESSION['newQCM']->setLibelléQCM($_POST['LibelléQCM']);
                    $_SESSION['newQCM']->setIdThème($_POST['ComboBoxIdThème']);

                    $_SESSION['NbQuestion'] = $_POST['NbQuestion'];
               } else {
                    self::Message("Erreur", "Veuillez remplir tout les champs");
               }
          }
          if (isset($_POST['ValiderQuestion'])) {
               if (!empty($_POST['LibelléQuestion'])) {
                    $ListQuestion = $_SESSION['newQCM']->getListQuestion();
                    $_SESSION['newQCM']->setListQuestion([]);

                    $question = new Question();
                    $question->setLibelléQuestion($_POST['LibelléQuestion']);
                    $question->setTempsQuestion($_POST['TempsQuestion']);


                    for ($i = 0; $i < count($_POST['LibelléProposition']); $i++) {
                         if ($_POST['LibelléProposition'][$i] != null) {
                              $ListProposition = $question->getListProposition();
                              $question->setListProposition([]);
                              $proposition = new Proposition();

                              $proposition->setLibelléProposition($_POST['LibelléProposition'][$i]);
                              $proposition->setRésultatVraiFaux($_POST['RésultatVraiFaux'][$i]);

                              array_push($ListProposition,$proposition);

                              $question->setListProposition($ListProposition);
                         }
                    }
                    if (count($question->getListProposition()) != 0) {
                         array_push($ListQuestion, $question);
                    }else {
                         self::Message("Erreur","Veuillez renseigner au moins une proposition");
                    }

                    $_SESSION['newQCM']->setListQuestion($ListQuestion);

                    if ($_SESSION['newQCM']->NbQuestion() >= $_SESSION['NbQuestion']) {
                         
                         $_SESSION['newQCM']->Enregistrer();

                         $_SESSION['newQCM'] = null;
                         $_SESSION['NbQuestion'] = null;
                    }
               }else {
                    self::Message("Erreur","Veuillez saisir un libellé pour la question");
               }
          }
     }
}
