<?php

require_once "Model.php";
require_once "ModelUtilisateur.php";

/**
 * Class Enseignant
 *
 * This class is used to manage the teacher's data in the application.
 */
class Enseignant extends Utilisateur{
    // Attribut
    private $NbQCMCréés = 0;

    /**
     * Constructor of the class.
     *
     * @param int $IdUtilisateur The ID of the user.
     */
    public function __construct($IdUtilisateur = 0){
        parent::__construct($IdUtilisateur);
    }

    /**
     * Getter for the class attributes.
     *
     * @return int The number of QCMs created by the teacher.
     */
    public function getNbQCMCréés() {return $this->NbQCMCréés;}

    /**
     * Setter for the class attributes.
     *
     * @param int $value The number of QCMs created by the teacher.
     */
    public function setNbQCMCréés($value) {$this->NbQCMCréés = $value;}

    /**
     * Method to save the teacher's data.
     */
    function Enregistrer(){
        if (parent::getIdUtilisateur() == 0) {
            parent::Ajouter();
            $this->AjouterFormateur();
        }else{
            parent::Modifier();
        }
    }

    /**
     * Method to add a teacher.
     */
    function AjouterFormateur(){
        self::ExecuteQuery("INSERT INTO enseignant (IdUtilisateur) VALUES (". self::GetID() .")");
    }
}

/**
 * Function to list all teachers.
 *
 * @return array The list of all teachers.
 */
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