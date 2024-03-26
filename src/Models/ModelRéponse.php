<?php

require_once "Model.php";

/**
 * Class Réponse
 *
 * This class is used to manage the responses in the application.
 */
class Réponse extends Model
{
     // Attribut
     private $IdRésultat = 0;
     private $IdProposition = 0;
     private $RéponseElève = 0;

    /**
     * Constructor of the class.
     *
     * @param int $idresultat The ID of the result.
     * @param int $idproposition The ID of the proposition.
     */
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

    /**
     * Method to get the information of a response.
     */
     private function getInformation(){
          $reqSelect = self::ExecuteQuery("SELECT RéponseElève FROM réponse WHERE IdRésultat = $this->IdRésultat AND IdProposition = $this->IdProposition");

          foreach ($reqSelect as $resultat) {
               $this->RéponseElève = $resultat["RéponseElève"];
          }
     }

    /**
     * Method to save the response's data.
     */
     public function Enregistrer(){
          self::ExecuteQuery("INSERT INTO réponse (IdRésultat, IdProposition, RéponseElève) VALUES ($this->IdRésultat, $this->IdProposition, $this->RéponseElève)");
     }
}
