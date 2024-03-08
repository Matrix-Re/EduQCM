<?php

require_once "Model.php";

class Question extends Model
{
     // Attribut
     private $IdQuestion = 0;
     private $LibelléQuestion = "";
     private $TempsQuestion = null;
     private $ListProposition = [];

     // Constructeur
     function __construct($idquestion = 0)
     {
          if ($idquestion != 0) {
               $this->IdQuestion = $idquestion;
               $this->getInformation();
          }
     }

     // Accesseur
     public function getIdQuestion() {return $this->IdQuestion;}
     public function setIdQuestion($value) {$this->IdQuestion = $value;}

     public function getLibelléQuestion() {return $this->LibelléQuestion;}
     public function setLibelléQuestion($value) {$this->LibelléQuestion = $value;}

     public function getTempsQuestion() {return $this->TempsQuestion;}
     public function setTempsQuestion($value) {$this->TempsQuestion = $value;}
     
     public function getListProposition() {return $this->ListProposition;}
     public function setListProposition($value) {$this->ListProposition = $value;}

     // Méthode
     function getInformation()
     {
          $reqSelect = "SELECT LibelléQuestion, TempsQuestion FROM Thème WHERE IdQuestion = " . $this->IdQuestion;

          $resultatReq = self::ExecuteQuery($reqSelect);

          foreach ($resultatReq as $Question) {
               $this->LibelléQuestion      = $Question['LibelléQuestion'];
               $this->TempsQuestion  = $Question['TempsQuestion'];
          }
          $this->GetProposition();
     }

     public function Enregistrer($idqcm){
          if ($this->IdQuestion == 0) {
               $this->Ajouter($idqcm);
          }
     }

     private function Ajouter($idqcm){

          $parameters = array($this->LibelléQuestion,$this->TempsQuestion,$idqcm);

          self::ExecuteQuery("INSERT INTO question(LibelléQuestion, TempsQuestion, IdQCM) VALUES (?,?,?)",$parameters);

          $this->IdQuestion = self::GetID();

          foreach ($this->ListProposition as $Proposition) {
               $Proposition->Enregistrer($this->IdQuestion);
          }    
     }

     function GetProposition()
     {
          $reqSelect = self::ExecuteQuery("SELECT IdProposition, LibelléProposition, RésultatVraiFaux FROM Proposition WHERE IdQuestion = $this->IdQuestion");

          foreach ($reqSelect as $proposition) {
               $Proposition = new Proposition();

               $Proposition->setIdProposition($proposition["IdProposition"]);
               $Proposition->setLibelléProposition($proposition["LibelléProposition"]);
               $Proposition->setRésultatVraiFaux($proposition["RésultatVraiFaux"]);
               
               array_push($this->ListProposition, $Proposition);
          }
     }
}
