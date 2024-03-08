<?php

require_once "Model.php";
require_once "ModelUtilisateur.php";

class Enseignant extends Utilisateur{
    // Attribut
    private $NbQCMCréés = 0;

    // Constructeur
    public function __construct($IdUtilisateur = 0){
        parent::__construct($IdUtilisateur);
    }

    // Accesseur
    public function getNbQCMCréés() {return $this->NbQCMCréés;}
    public function setNbQCMCréés($value) {$this->NbQCMCréés = $value;}

    // Méthode
    function Enregistrer(){
        if (parent::getIdUtilisateur() == 0) {
            parent::Ajouter();
            $this->AjouterFormateur();
        }else{
            parent::Modifier();
        }
    }

    function AjouterFormateur(){
        self::ExecuteQuery("INSERT INTO enseignant (IdUtilisateur) VALUES (". self::GetID() .")");
    }
}

//////////////////////////////
//    FONCTION HORS CLASS   //
//////////////////////////////

function ListEnseignant(){
    $ListEnseignant = [];
    $resultatReq = Model::ExecuteQuery("SELECT * FROM utilisateur, enseignant WHERE utilisateur.IdUtilisateur = enseignant.IdUtilisateur");

    foreach ($resultatReq as $enseignant) {
        
        $Enseignant = new Enseignant();

        $Enseignant->setIdUtilisateur($enseignant['IdUtilisateur']);
        $Enseignant->setNom($enseignant['Nom']);
        $Enseignant->setPrénom($enseignant['Prénom']);
        $Enseignant->setLogin($enseignant['Login']);
        $Enseignant->setMotDePasse($enseignant['Password']);
        $Enseignant->setNbQCMCréés($enseignant['NbQCMCréés']);

        array_push($ListEnseignant,$Enseignant);

    }
    return $ListEnseignant;
}