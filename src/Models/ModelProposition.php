<?php

require_once "Model.php";

/**
 * Class Proposition
 *
 * This class is used to manage the propositions in the application.
 */
class Proposition extends Model{
    // Attribut
    private $IdProposition = 0;
    private $LibelléProposition = "";
    private $RésultatVraiFaux = false;

    /**
     * Constructor of the class.
     */
    function __construct()
    {
    }

    /**
     * Getter for the class attributes.
     *
     * @return int The ID of the proposition.
     */
    public function getIdProposition() {return $this->IdProposition;}

    /**
     * Setter for the class attributes.
     *
     * @param int $value The ID of the proposition.
     */
    public function setIdProposition($value) {$this->IdProposition = $value;}

    /**
     * Getter for the class attributes.
     *
     * @return string The label of the proposition.
     */
    public function getLibelléProposition() {return $this->LibelléProposition;}

    /**
     * Setter for the class attributes.
     *
     * @param string $value The label of the proposition.
     */
    public function setLibelléProposition($value) {$this->LibelléProposition = $value;}

    /**
     * Getter for the class attributes.
     *
     * @return bool The result of the proposition (true or false).
     */
    public function getRésultatVraiFaux() {return $this->RésultatVraiFaux;}

    /**
     * Setter for the class attributes.
     *
     * @param bool $value The result of the proposition (true or false).
     */
    public function setRésultatVraiFaux($value) {$this->RésultatVraiFaux = $value;}

    /**
     * Method to save the proposition's data.
     *
     * @param int $idquestion The ID of the question.
     */
    public function Enregistrer($idquestion){
        if ($this->IdProposition == 0) {
            $this->Ajouter($idquestion);
       }
    }

    /**
     * Method to add a proposition.
     *
     * @param int $idquestion The ID of the question.
     */
    private function Ajouter($idquestion){

        $parameters = array($this->LibelléProposition,$this->RésultatVraiFaux,$idquestion);

        self::ExecuteQuery("INSERT INTO proposition(LibelléProposition, RésultatVraiFaux, IdQuestion) VALUES (?,?,?)",$parameters);

    }
}
