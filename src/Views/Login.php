<?php

require_once './Views/View.php';
Class Login extends View{

    public function __construct()
    {
        ?>
        <div class="d-flex align-items-center h-100 text-center">
            <div class="m-auto formConnexion">
                <h3>Accueil du site QCM :</h3>

                <form method="POST">
                    <input type="text" class="form-control ConnexionInput" name="Login" placeholder="Login"><br>

                    <input type="text" class="form-control ConnexionInput" name="Password" placeholder="Mot de passe"><br>

                    <input type="submit" value="OK" class="btn btn-outline-primary" name="OK"><br>

                    <b class="text-danger">Vous devez obligatoirement saisir un login et mot de passe pour entrer sur l'application QCM.</b>

                </form>

            </div>
        </div>
        <?php
    }

}