<?php

require_once './Views/View.php';

/**
 * Class AffectationQCM
 *
 * This class is used to manage the QCM assignments in the application.
 */
class AffectationQCM extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the QCM assignment.
     */
    public function __construct($Data = [""])
    {
        extract($Data);
        require "./Views/Champs/Header.php";

?>
        <h2>Affectation d'un QCM</h2>
        <form method="POST">
            <?php


            require "./Views/Champs/ComboBox/ComboListQCM.php";

            require "./Views/Champs/Input/InputDate.php";

            require "./Views/Champs/Tableau/ListAffectation.php";

            View::GenerateButton("Valider", "btn btn-primary", "", "AffectationQCMValider","AffectationQCMValider")
            ?>
        </form>
<?php
    }
}
