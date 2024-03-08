<?php

require_once "Model.php";

class Proposition extends Model{
    // Attribut
    private $IdProposition = 0;
    private $LibelléProposition = "";
    private $RésultatVraiFaux = false;

    // Constructeur
    function __construct()
    {
    }

    // Accesseur
    public function getIdProposition() {return $this->IdProposition;}
    public function setIdProposition($value) {$this->IdProposition = $value;}

    public function getLibelléProposition() {return $this->LibelléProposition;}
    public function setLibelléProposition($value) {$this->LibelléProposition = $value;}

    public function getRésultatVraiFaux() {return $this->RésultatVraiFaux;}
    public function setRésultatVraiFaux($value) {$this->RésultatVraiFaux = $value;}

    // Méthode
    public function Enregistrer($idquestion){
        if ($this->IdProposition == 0) {
            $this->Ajouter($idquestion);
       }
    }

    private function Ajouter($idquestion){

        $parameters = array($this->LibelléProposition,$this->RésultatVraiFaux,$idquestion);

        self::ExecuteQuery("INSERT INTO proposition(LibelléProposition, RésultatVraiFaux, IdQuestion) VALUES (?,?,?)",$parameters);

    }
}
