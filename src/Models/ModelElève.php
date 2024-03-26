<?php

require_once "Model.php";
require_once "ModelUtilisateur.php";

/**
 * Class Elève
 *
 * This class is used to manage the student's data in the application.
 */
class Elève extends Utilisateur{
    // Attribut
    private $NbQCMRéalisés = 0;
    private $MoyenneQCM = 0;

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
     * @return int The number of QCMs realized by the student.
     */
     public function getNbQCMRéalisés() {return $this->NbQCMRéalisés;}

    /**
     * Setter for the class attributes.
     *
     * @param int $value The number of QCMs realized by the student.
     */
    public function setNbQCMRéalisés($value) {$this->NbQCMRéalisés = $value;}

    /**
     * Getter for the class attributes.
     *
     * @return int The average score of the student in the QCMs.
     */
    public function getMoyenneQCM() {return $this->MoyenneQCM;}

    /**
     * Setter for the class attributes.
     *
     * @param int $value The average score of the student in the QCMs.
     */
    public function setMoyenneQCM($value) {$this->MoyenneQCM = $value;}

    /**
     * Method to save the student's data.
     */
    function Enregistrer(){
        if ($this->getIdUtilisateur() == 0) {
            parent::Ajouter();
            $this->AjouterElève();
        }else{
            parent::Modifier();
        }
    }

    /**
     * Method to add a student.
     */
    function AjouterElève(){
        self::ExecuteQuery("INSERT INTO elève (IdUtilisateur) VALUES (". self::GetID() .")");
    }
}

/**
 * Function to list all students.
 *
 * @return array The list of all students.
 */
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