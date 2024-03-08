<?php

abstract class Model
{
     // Attribut
     public static $db = NULL;
     private static $AddressBDD = "localhost";
     private static $TypeServer = "mysql:host";
     private static $DBName = "QCM";
     private static $TypeBDD = "dbname";
     private static $Login = "root";
     private static $password = "";

     // Méthode
     private static function SetBdd()
     {
          $bdd =  self::$TypeServer . "=" . self::$AddressBDD . ";" . self::$TypeBDD . "=" . self::$DBName;
          $user = self::$Login;
          $pass = self::$password;

          try {
               self::$db = new PDO($bdd, $user, $pass);
          } catch (Exception $th) {               
               die(Controller::Message("Erreur BDD", "Impossible de se connecter à la base de données<br>".$th->getMessage()));
          }
     }

     public static function ExecuteQuery($query, $parameters = NULL)
     {
          $resultat = NULL;
          if (self::$db == NULL) {
               self::SetBdd();
          }

          try {
               // Préparation est execution de la requête
               $req = self::$db->prepare($query);
               $execution = $req->execute($parameters);

               if ($execution == false) {
                    throw new Exception("Une erreur est survenue lors de l'execution de la requête.");
               }

               // Si la requête est une selection on récupère les données
               if (strpos(strtolower($query), "select") === 0) {
                    try {
                         $resultat = $req->fetchAll();
                    } catch (\Throwable $th) {
                         die(Controller::Message("Erreur execution requête", "Impossible de récupérer le résultat de la requête<br>".$th."<br>".$query));
                    }
               }
          } catch (Throwable $th) {               
               die(Controller::Message("Erreur execution requête", "Impossible d'executer la requête<br>".$th."<br>".$query));
          }

          return $resultat;
     }

     public static function GetID()
     {
          return self::$db->lastInsertId();
     }
}
