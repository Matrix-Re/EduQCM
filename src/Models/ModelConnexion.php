<?php

require_once "Model.php";

/**
 * Class ModelConnexion
 *
 * This class is used to manage the user's connection to the application.
 */
class ModelConnexion extends Model
{

     // Atributs
     private $Identifiant = "";
     private $ID_User = 0;
     private $TypeUser = "";

     /**
     * Getter for the class attributes.
     *
     * @param string $name The name of the attribute to get.
     * @return mixed The value of the attribute.
     */
     public function __get($name)
     {
          return $this->$name;
     }

     /**
     * Setter for the class attributes.
     *
     * @param string $name The name of the attribute to set.
     * @param mixed $value The value to set the attribute to.
     */
     public function __set($name, $value)
     {
          $this->$name = $value;
     }

     /**
     * Logs the user into the application.
     *
     * @param string $Login The user's login.
     * @param string $Password The user's password.
     */
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

     /**
     * Logs the user out of the application.
     */
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

/**
 * Checks if the user is connected.
 */
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
