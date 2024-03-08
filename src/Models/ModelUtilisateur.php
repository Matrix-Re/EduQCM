<?php

require_once "Model.php";

class Utilisateur extends Model{
    // Attribut
    private $IdUtilisateur = 0;
    private $Nom = "";
    private $Prénom = "";
    private $Login = "";
    private $MotDePasse = "";

    // Constructeur
    function __construct($IdUtilisateur = 0)
    {
        if ($IdUtilisateur != 0) {
            $this->IdUtilisateur = $IdUtilisateur;
            $this->getInformation();
        }
    }

    // Accesseur
    public function getIdUtilisateur() {return $this->IdUtilisateur;}
    public function setIdUtilisateur($value) {$this->IdUtilisateur = $value;}

    public function getNom() {return $this->Nom;}
    public function setNom($value) {$this->Nom = $value;}

    public function getPrénom() {return $this->Prénom;}
    public function setPrénom($value) {$this->Prénom = $value;}

    public function getLogin() {return $this->Login;}
    public function setLogin($value) {$this->Login = $value;}

    public function getMotDePasse() {return $this->MotDePasse;}
    public function setMotDePasse($value) {$this->MotDePasse = $value;}

    // Méthode
    function getInformation(){
        $reqSelect = "SELECT
              IdUtilisateur as IdUtilisateur,
              Nom as Nom,
              Prénom as Prénom,
              Login as Login,
              Password as Password
              FROM 
              utilisateur   
              WHERE         
              IdUtilisateur = $this->IdUtilisateur";
              
            $resultatReq = self::ExecuteQuery($reqSelect);

            foreach ($resultatReq as $Utilisateur) {
                $this->IdUtilisateur    = $Utilisateur['IdUtilisateur'];
                $this->Nom              = $Utilisateur['Nom'];
                $this->Prénom           = $Utilisateur['Prénom'];
                $this->Login            = $Utilisateur['Login'];
                $this->MotDePasse       = $Utilisateur['Password'];
            }
    }    

    function Ajouter(){
        self::ExecuteQuery("INSERT INTO Utilisateur (Nom, Prénom, Login, Password) VALUES('$this->Nom', '$this->Prénom', '$this->Login', '$this->MotDePasse')");
    }

    function Modifier(){
        self::ExecuteQuery("UPDATE Utilisateur SET Nom = '$this->Nom', Prénom = '$this->Prénom', Login = '$this->Login', Password = '$this->MotDePasse' WHERE IdUtilisateur = $this->IdUtilisateur");
    }

    function Supprimer(){
        self::ExecuteQuery("DELETE FROM Utilisateur WHERE IdUtilisateur = " . $this->IdUtilisateur);
        Controller::Message("Information","Le compte de <b>" . $this->Nom . "</b> a été supprimé");
    }
}