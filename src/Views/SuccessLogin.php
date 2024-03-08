<?php

require_once './Views/View.php';
Class SuccessLogin extends View{

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