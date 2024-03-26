<?php

require_once "Model.php";

/**
 * Class Résultat
 *
 * This class is used to manage the results in the application.
 */
class Résultat extends Model
{
     // Attribut
     private $IdRésultat = 0;
     private $DateAffectation = null;
     private $DateRéalisation = null;
     private $Note = 0;
     private $IdQCM = 0;
     private $IdUtilisateur = 0;

    /**
     * Constructor of the class.
     *
     * @param int $idresultat The ID of the result.
     */
     function __construct($idresultat = 0)
     {
          if ($idresultat != 0) {
               $this->IdRésultat = $idresultat;
               $this->getInformation();
          }
     }

     // Accesseur
     public function getIdRésultat() {return $this->IdRésultat;}
     public function setIdRésultat($value) {$this->IdRésultat = $value;}

     public function getDateAffectation() {return $this->DateAffectation;}
     public function setDateAffectation($value) {$this->DateAffectation = $value;}

     public function getDateRéalisation() {return $this->DateRéalisation;}
     public function setDateRéalisation($value) {$this->DateRéalisation = $value;}

     public function getNote() {return $this->Note;}
     public function setNote($value) {$this->Note = $value;}

     public function getIdQCM() {return $this->IdQCM;}
     public function setIdQCM($value) {$this->IdQCM = $value;}

     public function getIdUtilisateur() {return $this->IdUtilisateur;}
     public function setIdUtilisateur($value) {$this->IdUtilisateur = $value;}

    /**
     * Method to get the information of a result.
     */
     private function getInformation()
     {
          $reqSelect = self::ExecuteQuery("SELECT DateAffectation, DateRéalisation, Note, IdQCM, IdUtilisateur FROM résultat WHERE IdRésultat = $this->IdRésultat");

          foreach ($reqSelect as $resultat) {
               $this->DateAffectation = $resultat["DateAffectation"];
               $this->DateRéalisation = $resultat["DateRéalisation"];
               $this->Note = $resultat["Note"];
               $this->IdQCM = $resultat["IdQCM"];
               $this->IdUtilisateur = $resultat["IdUtilisateur"];
          }
     }

    /**
     * Method to save the result's data.
     */
     public function Enregistrer()
     {
          $date = date('Y-m-d');
          self::ExecuteQuery("UPDATE elève SET NbQCMRéalisés = NbQCMRéalisés + 1 WHERE IdUtilisateur = " . $this->IdUtilisateur);
          self::ExecuteQuery("UPDATE Résultat SET Dateréalisation = '" . $date . "', Note = " . $this->CalculNoteQCM() . " WHERE IdRésultat = $this->IdRésultat");
     }

    /**
     * Method to calculate the note of a QCM.
     *
     * @return int The note of the QCM.
     */
     private function CalculNoteQCM()
     {
          $Note = 20;
          $QCM = new QCM($this->IdQCM);
          $QCM->getQuestion();
          $NbQuestion = $QCM->NbQuestion();

          $reqResult = self::ExecuteQuery("SELECT proposition.IdProposition, proposition.RésultatVraiFaux, proposition.IdQuestion, CASE WHEN réponse.IdRésultat IS NOT NULL THEN True ELSE FALSE END as 'CaseCoché' FROM proposition LEFT OUTER JOIN réponse ON proposition.IdProposition = réponse.IdProposition AND IdRésultat = $this->IdRésultat
               WHERE proposition.IdProposition IN (SELECT IdProposition FROM proposition,	qcm,	question WHERE	proposition.IdQuestion = question.IdQuestion	AND question.IdQCM = qcm.IdQCM AND	qcm.IdQCM = $this->IdQCM)");     

          $IdQuestionToSkip = 0;
          foreach ($reqResult as $question) {
               
               if($IdQuestionToSkip != $question["IdQuestion"]){
                    $IdQuestionToSkip = 0;
                    if($question["RésultatVraiFaux"] != $question["CaseCoché"]){

                         $Note -= 20 / $NbQuestion;
                         $IdQuestionToSkip = $question["IdQuestion"];
     
                    }
               }               

          }

          return $Note;
     }

    /**
     * Method to get the details of a result.
     *
     * @return array The details of the result.
     */
     public function Détails()
     {
          $Validée = [];
          $QCM = new QCM($this->IdQCM);
          $QCM->getQuestion();
          $NbQuestion = $QCM->NbQuestion();

          for ($i=0; $i < $NbQuestion; $i++) { 
               array_push($Validée, 1);
          }

          $reqResult = self::ExecuteQuery("SELECT proposition.IdProposition, proposition.RésultatVraiFaux, proposition.IdQuestion, CASE WHEN réponse.IdRésultat IS NOT NULL THEN True ELSE FALSE END as 'CaseCoché' FROM proposition LEFT OUTER JOIN réponse ON proposition.IdProposition = réponse.IdProposition AND IdRésultat = $this->IdRésultat
          WHERE proposition.IdProposition IN (SELECT IdProposition FROM proposition,	qcm,	question WHERE	proposition.IdQuestion = question.IdQuestion	AND question.IdQCM = qcm.IdQCM AND	qcm.IdQCM = $this->IdQCM)");

          $Indice = -1;
          $IdQuestionTraité = 0;
          $IdQuestionToSkip = 0;
          foreach ($reqResult as $question) {

               if ($IdQuestionTraité != $question["IdQuestion"]) {
                    $IdQuestionTraité = $question["IdQuestion"];
                    $Indice++;
               }
               
               if($IdQuestionToSkip != $question["IdQuestion"]){
                    $IdQuestionToSkip = 0;
                    if($question["RésultatVraiFaux"] != $question["CaseCoché"]){

                         $Validée[$Indice] = 0;
                         $IdQuestionToSkip = $question["IdQuestion"];
     
                    }
               }               

          }

          return $Validée;
     }
}
