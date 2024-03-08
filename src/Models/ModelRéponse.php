<?php

require_once "Model.php";

class Réponse extends Model
{
     // Attribut
     private $IdRésultat = 0;
     private $IdProposition = 0;
     private $RéponseElève = 0;

     // Constructeur
     function __construct($idresultat = 0,$idproposition = 0)
     {
          if ($idresultat != 0 && $idproposition != 0) {
               $this->IdRésultat = $idresultat;
               $this->IdProposition = $idproposition;
               $this->getInformation();
          }
     }

     // Accesseur
     public function getIdRésultat() {return $this->IdRésultat;}
     public function setIdRésultat($value) {$this->IdRésultat = $value;}

     public function getIdProposition() {return $this->IdProposition;}
     public function setIdProposition($value) {$this->IdProposition = $value;}

     public function getRéponseElève() {return $this->RéponseElève;}
     public function setRéponseElève($value) {$this->RéponseElève = $value;}

     // Méthode
     private function getInformation(){
          $reqSelect = self::ExecuteQuery("SELECT RéponseElève FROM réponse WHERE IdRésultat = $this->IdRésultat AND IdProposition = $this->IdProposition");

          foreach ($reqSelect as $resultat) {
               $this->RéponseElève = $resultat["RéponseElève"];
          }
     }

     public function Enregistrer(){
          self::ExecuteQuery("INSERT INTO réponse (IdRésultat, IdProposition, RéponseElève) VALUES ($this->IdRésultat, $this->IdProposition, $this->RéponseElève)");
     }
}
