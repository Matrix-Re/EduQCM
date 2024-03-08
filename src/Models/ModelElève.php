<?php

require_once "Model.php";
require_once "ModelUtilisateur.php";

class Elève extends Utilisateur{
    // Attribut
    private $NbQCMRéalisés = 0;
    private $MoyenneQCM = 0;

    // Constructeur
    public function __construct($IdUtilisateur = 0){
        parent::__construct($IdUtilisateur);
    }

    // Accesseur
    public function getNbQCMRéalisés() {return $this->NbQCMRéalisés;}
    public function setNbQCMRéalisés($value) {$this->NbQCMRéalisés = $value;}

    public function getMoyenneQCM() {return $this->MoyenneQCM;}
    public function setMoyenneQCM($value) {$this->MoyenneQCM = $value;}

    // Méthode
    function Enregistrer(){
        if ($this->getIdUtilisateur() == 0) {
            parent::Ajouter();
            $this->AjouterElève();
        }else{
            parent::Modifier();
        }
    }

    function AjouterElève(){
        self::ExecuteQuery("INSERT INTO elève (IdUtilisateur) VALUES (". self::GetID() .")");
    }
}

//////////////////////////////
//    FONCTION HORS CLASS   //
//////////////////////////////

function ListElève(){
    $ListElève = [];
    $resultatReq = Model::ExecuteQuery("SELECT * FROM utilisateur, elève WHERE utilisateur.IdUtilisateur = elève.IdUtilisateur;");

    foreach ($resultatReq as $elève) {
        
        $Elève = new Elève();

        $Elève->setIdUtilisateur($elève['IdUtilisateur']);
        $Elève->setNom($elève['Nom']);
        $Elève->setPrénom($elève['Prénom']);
        $Elève->setLogin($elève['Login']);
        $Elève->setMotDePasse($elève['Password']);
        $Elève->setNbQCMRéalisés($elève['NbQCMRéalisés']);
        $Elève->setMoyenneQCM($elève['MoyenneQCM']);

        array_push($ListElève,$Elève);

    }
    return $ListElève;
}