<?php

require_once './Views/View.php';
class AffectationQCM extends View
{

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
