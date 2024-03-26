<?php

require_once './Views/View.php';

/**
 * Class SuccessLogin
 *
 * This class is used to display a success message after a successful login.
 */
Class SuccessLogin extends View{

    /**
     * Constructor of the class.
     *
     * It displays a welcome message and a button to continue to the application.
     */
    public function __construct()
    {
        $Nom = "";

        if (!empty($_SESSION['Connexion'])) {
            $Nom = $_SESSION['Connexion']->__get('Identifiant');
        }

        ?>
        <div class="container text-center" style="height: 100vh;padding-top:20%;">
            <div class="row align-items-end">
                <div class="col align-self-center">
                    <b>Bonjour <?= $Nom ?>, cliquez sur le bouton <b class="text-danger">ENTRER</b> <br> pour continuer sur l'application QCM.</b>
                    <br>
                    <a class="btn btn-secondary" href="Home">ENTRER</a>
                </div>
            </div>
        </div>
        <?php
    }

}