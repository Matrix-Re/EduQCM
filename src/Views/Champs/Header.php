<?php

$Identifiant = "";
$Type = "test";

if (isset($_SESSION['Connexion'])) {
    $Identifiant = $_SESSION['Connexion']->Identifiant;
    $Type = $_SESSION['Connexion']->TypeUser;
}

?>
<!-- INFORMATION -->
<div class="HeaderInformation">
    <b>Application QCM</b>
    <b><?= "Utilisateur : " . $Identifiant; ?></b>
    <b><?= "Type : " . $Type; ?></b>
</div>

<!-- NAVIGATION -->
<header class="d-flex justify-content-center">
    <ul class="nav nav-pills">

        <?php if ($Type == "Enseignant") { ?>

            <li class="nav-item">
                <?php View::GenerateButton('Affectection d\'un QCM', 'btn btn-light', '/AffectationQCM'); ?>
            </li>
            <li class="nav-item">
                <?php View::GenerateButton('Résultats', 'btn btn-light', '/resultats'); ?>
            </li>
            <li class="nav-item">
                <?php View::GenerateButton('Gestion des QCM', 'btn btn-light', '/GestionDesQCM'); ?>
            </li>
            <li class="nav-item">
                <?php View::GenerateButton('Gestion des comptes', 'btn btn-light', '/GestionDesComptes'); ?>
            </li>
            <li class="nav-item">
                <?php View::GenerateButton('Gestion des groupes', 'btn btn-danger'); ?>
            </li>

        <?php } ?>

        <li class="nav-item">
            <?php View::GenerateButton('Déconnexion', 'btn btn-light', '', 'Déconnexion', 'Déconnexion'); ?>
        </li>
    </ul>
</header>