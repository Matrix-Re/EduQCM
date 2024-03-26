<?php

require_once './Views/View.php';

/**
 * Class Resultats
 *
 * This class is used to display the results of the QCM in the application.
 */
Class Resultats extends View{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the results display.
     */
    public function __construct($Data = [""])
    {
        extract($Data);
        require "./Views/Champs/Header.php";

        require "./Views/Champs/Information/InfoQCM.php";

        require "./Views/Champs/Tableau/ListSynthèseRésultat.php";

        self::GenerateButton("Accueil","btn btn-primary","/Home");
    }

}