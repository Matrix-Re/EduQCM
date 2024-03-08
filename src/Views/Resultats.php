<?php

require_once './Views/View.php';
Class Resultats extends View{

    public function __construct($Data = [""])
    {
        extract($Data);
        require "./Views/Champs/Header.php";

        require "./Views/Champs/Information/InfoQCM.php";

        require "./Views/Champs/Tableau/ListSynthèseRésultat.php";

        self::GenerateButton("Accueil","btn btn-primary","/Home");
    }

}