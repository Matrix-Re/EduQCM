<?php

require_once "Model.php";

/**
 * Class Thème
 *
 * This class is used to manage the themes in the application.
 */
class Thème extends Model{
    // Attribut
    private $IdThème = 0;
    private $Description = "";

    /**
     * Constructor of the class.
     *
     * @param int $idthème The ID of the theme.
     */
    function __construct($idthème = 0)
    {
        if ($idthème != 0) {
            $this->IdThème = $idthème;
            $this->getInformation();
        }
    }

    // Accesseur
    public function getIdThème() {return $this->IdThème;}
    public function setIdThème($value) {$this->IdThème = $value;}

    public function getDescription() {return $this->Description;}
    public function setDescription($value) {$this->Description = $value;}

    /**
     * Method to get the information of a theme.
     */
    function getInformation(){
        $reqConnexion = "SELECT IdThème, Description FROM Thème WHERE IdThème = " . $this->IdThème;
              
            $resultatReq = self::ExecuteQuery($reqConnexion);

            foreach ($resultatReq as $IdUtilisateur) {
                $this->IdThème      = $IdUtilisateur['IdThème'];
                $this->Description  = $IdUtilisateur['Description'];
            }
    }
}

/**
 * Function to list all themes.
 *
 * @return array The list of all themes.
 */
function ListThème(){
    $ListThème = [];
    $resultatReq = Model::ExecuteQuery("SELECT IdThème, Description FROM thème WHERE 1");

    foreach ($resultatReq as $thème) {
        
        $QCM = new Thème();

        $QCM->setIdThème($thème['IdThème']);
        $QCM->setDescription($thème['Description']);

        array_push($ListThème,$QCM);

    }
    return $ListThème;
}