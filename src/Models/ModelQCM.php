<?php

require_once "Model.php";
require_once "ModelThèmes.php";
require_once "ModelQuestion.php";
require_once "ModelProposition.php";

class QCM extends Model{
    // Attribut
    private $IdQCM = 0;
    private $LibelléQCM = "";
    private $IdAuteur = "";
    private $IdThème = 0;
    private $ListQuestion = [];

    // Constructeur
    function __construct($idqcm = 0)
    {
        if ($idqcm != 0) {
            $this->IdQCM = $idqcm;
            $this->getInformation();
        }
    }

    // Accesseur
    public function getIdQCM() {return $this->IdQCM;}
    public function setIdQCM($value) {$this->IdQCM = $value;}

    public function getLibelléQCM() {return $this->LibelléQCM;}
    public function setLibelléQCM($value) {$this->LibelléQCM = $value;}

    public function getIdAuteur() {return $this->IdAuteur;}
    public function setIdAuteur($value) {$this->IdAuteur = $value;}

    public function getIdThème() {return $this->IdThème;}
    public function setIdThème($value) {$this->IdThème = $value;}

    public function getListQuestion() {return $this->ListQuestion;}
    public function setListQuestion($value) {$this->ListQuestion = $value;}

    public function NbQuestion(){
        return $this->CompteNbQuestion();
    }    

    // Méthode
    private function getInformation(){
        $reqSelect = "SELECT IdQCM, LibelléQCM, IdAuteur, IdThème FROM QCM WHERE IdQCM = " . $this->IdQCM;
              
        $resultatReq = self::ExecuteQuery($reqSelect);

        foreach ($resultatReq as $QCM) {
            $this->IdQCM        = $QCM['IdQCM'];
            $this->LibelléQCM   = $QCM['LibelléQCM'];
            $this->IdAuteur     = $QCM['IdAuteur'];
            $this->IdThème     = $QCM['IdThème'];
        }
    }

    public function Enregistrer(){
        if ($this->IdQCM == 0) {
            $this->Ajouter();
        }
    }

    private function Ajouter(){

        $parameters = array($this->LibelléQCM,$_SESSION['Connexion']->__get("ID_User"),$this->IdThème);

        self::ExecuteQuery("INSERT INTO qcm(LibelléQCM, IdAuteur, IdThème) VALUES (?,?,?)",$parameters);

        $this->IdQCM = self::GetID();

        foreach ($this->ListQuestion as $Question) {
            $Question->Enregistrer($this->IdQCM);
        }    
        Controller::Message("Information","Le QCM <b>$this->LibelléQCM</b> à été crée");    
    }

    private function CompteNbQuestion(){
        return count($this->ListQuestion);
    }

    public function getQuestion(){
        $this->ListQuestion = [];
        $reqResult = self::ExecuteQuery("SELECT IdQuestion, LibelléQuestion, TempsQuestion FROM question WHERE IdQCM = $this->IdQCM");
        
        foreach ($reqResult as $question) {
            $Question = new Question();

            $Question->setIdQuestion($question['IdQuestion']);
            $Question->setLibelléQuestion($question['LibelléQuestion']);
            $Question->setTempsQuestion($question['TempsQuestion']);

            $Question->GetProposition();

            array_push($this->ListQuestion, $Question);
        }        
    }    

    public function AffectationQCM(){
        // Initialisation
        $reqValues = "";
        $NbElément = 0;
        $ListUtilisateurAffecté = "";
        foreach ($_POST['AffectationQCMIdUtilisateur'] as $user) {
            $Utilisateur = new Utilisateur($user);
            $ListUtilisateurAffecté .= $Utilisateur->getNom();

            $reqValues .= "('" . $_POST['AffectationQCMDate'] . "'," .
            $_POST['ComboBoxIdQCM'] . "," .
            $user . ")";

            $NbElément++;
            if ($NbElément != count($_POST['AffectationQCMIdUtilisateur'])) {
                $reqValues .= ',';
                $ListUtilisateurAffecté .= ' - ';
            }            
        }

        self::ExecuteQuery("INSERT INTO résultat (DateAffectation, IdQCM, IdUtilisateur) VALUES $reqValues");
        Controller::Message("Inforamation","Le QCM " . $this->LibelléQCM . " à été affecté à : " . $ListUtilisateurAffecté);
    }

    public function Supprimer(){
        if(empty(self::ExecuteQuery("SELECT * FROM Résultat WHERE IdQCM = $this->IdQCM AND Note IS NOT NULL"))){
            self::ExecuteQuery("DELETE FROM QCM WHERE IdQCM = $this->IdQCM");
            Controller::Message("Information","Le QCM $this->LibelléQCM à été supprimé");
        }else {
            Controller::Message("Erreur","Impossible de supprimer le QCM ce dernier à déja etait réaliser par au moins un élève");
        }        
    }
}

function ListQCM(){
    $ListQCM = [];
    $resultatReq = Model::ExecuteQuery("SELECT IdQCM, LibelléQCM, IdAuteur, IdThème FROM QCM WHERE 1");

    foreach ($resultatReq as $qcm) {
        
        $QCM = new QCM();

        $QCM->setIdQCM($qcm['IdQCM']);
        $QCM->setLibelléQCM($qcm['LibelléQCM']);
        $QCM->setIdAuteur($qcm['IdAuteur']);
        $QCM->setIdThème($qcm['IdThème']);

        array_push($ListQCM,$QCM);

    }
    return $ListQCM;
}