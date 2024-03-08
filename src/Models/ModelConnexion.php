<?php

require_once "Model.php";

class ModelConnexion extends Model
{

     // Atributs
     private $Identifiant = "";
     private $ID_User = 0;
     private $TypeUser = "";

     // Accesseurs
     public function __get($name)
     {
          return $this->$name;
     }
     public function __set($name, $value)
     {
          $this->$name = $value;
     }

     // Méthodes
     public function Login($Login, $Password)
     {
          if ($Login != null && $Password != null) {
               $MotDePasseCorrecte = false;

               $reqConnexion = "SELECT
              utilisateur.Prénom as Prénom,
              utilisateur.Password as Password,
              enseignant.IdUtilisateur as Enseignant, 
              elève.IdUtilisateur as Elève
              FROM 
              utilisateur 
              LEFT OUTER JOIN
              enseignant ON
              utilisateur.IdUtilisateur = enseignant.IdUtilisateur              
              LEFT OUTER JOIN
              elève ON
              utilisateur.IdUtilisateur = elève.IdUtilisateur              
              WHERE              
              utilisateur.Login = '$Login'";

               $resultat = self::ExecuteQuery($reqConnexion);

               if (!empty($resultat)) {
                    if ($Password == $resultat[0]['Password']) {
                         // On enregistre l'ID Client dans la session
                         if (!empty($resultat[0]['Enseignant'])) {
                              $this->ID_User = $resultat[0]['Enseignant'];
                              $this->TypeUser = "Enseignant";
                         }
                         if (!empty($resultat[0]['Elève'])) {
                              $this->ID_User = $resultat[0]['Elève'];
                              $this->TypeUser = "Elève";
                         }
                         $this->Identifiant = $resultat[0]['Prénom'];

                         $reqSelect = "SELECT * FROM `enseignant` WHERE 1";

                         // On redirige vers la page d'accueil  
                         $_SESSION['Connexion'] = $this;
                    } else {
                         Controller::Message("Erreur", "Identifiant ou mot de passe incorrecte");
                         $_SESSION['Connexion'] = null;
                    }
               } else {
                    Controller::Message("Erreur", "Identifiant ou mot de passe incorrecte");
                    $_SESSION['Connexion'] = null;
               }
          } else {
               Controller::Message("Erreur", "Veuillez saisir un identifiant et un mot de passe");
          }
     }

     public function Logout()
     {
          $this->ID_User = 0;
          $_SESSION['Connexion'] = NULL;

          $_SESSION['RéalisationEnCour'] = null;
          $_SESSION['IdRésultat'] = null;
          $_SESSION['NuméroQuestion'] = null;
          $_SESSION['ListReponse'] = null;
          $_SESSION['NbQuestion'] = null;

          header("Location:" . UrlSite);
     }
}

// Fonction Hors Class
function IsConnected()
{
     if ($_SESSION['Connexion'] == NULL) {
          header("Location:" . UrlSite);
          exit;
     } else {
          if ($_SESSION['Connexion']->__get('ID_User') == 0) {
               header("Location:" . UrlSite);
               exit;
          }
     }
}

function IsTeacher()
{
     if ($_SESSION['Connexion']->__get("TypeUser") != "Enseignant") {
          header("Location:" . UrlSite . "Home");
          exit;
     }
}
