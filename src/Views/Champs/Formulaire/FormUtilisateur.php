<?php

$Nom = "";
$Prenom = "";
$Login = "";
$MotDePasse = "";

$Libellé = "Crée";
$ID = "00";
$Name = "CréationCompte";

$Disabled = "";
$TypeUtilisateur = ["", ""];

if (isset($Compte) && $Compte->getIdUtilisateur() != 0) {
     $Nom = $Compte->getNom();
     $Prenom = $Compte->getPrénom();
     $Login = $Compte->getLogin();
     $MotDePasse = $Compte->getMotDePasse();

     $Libellé = "Modifier";
     $ID = $Compte->getIdUtilisateur();
     $Name = "ModificationCompte";

     $Disabled = "disabled"; 

     $reqResult = Model::ExecuteQuery("SELECT 
	CASE WHEN elève.IdUtilisateur IS NOT NULL THEN 1 ELSE 0 END 'EstElève',
    CASE WHEN enseignant.IdUtilisateur IS NOT NULL THEN 1 ELSE 0 END 'EstEnseigant'
FROM utilisateur
	LEFT OUTER JOIN
    elève ON elève.IdUtilisateur = utilisateur.IdUtilisateur
    LEFT OUTER JOIN
    enseignant ON enseignant.IdUtilisateur = utilisateur.IdUtilisateur
WHERE utilisateur.IdUtilisateur = $ID");

     if ($reqResult[0]["EstElève"]) {
          $TypeUtilisateur[0] = "Selected";
     }

     if ($reqResult[0]["EstEnseigant"]) {
          $TypeUtilisateur[1] = "Selected";
     }
}


?>
<form method="POST">
     <input type="text" name="Nom" placeholder="Nom" value="<?= $Nom ?>">
     <input type="text" name="Prénom" placeholder="Prénom" value="<?= $Prenom ?>">
     <input type="text" name="Login" placeholder="Login" value="<?= $Login ?>">
     <input type="text" name="MotDePasse" placeholder="Mot de Passe" value="<?= $MotDePasse ?>">
     <select name="Type" <?= $Disabled ?>>
          <option value="">...</option>
          <option value="Elève" <?= $TypeUtilisateur[0] ?>>Elève</option>
          <option value="Formateur" <?= $TypeUtilisateur[1] ?>>Formateur</option>
     </select>

     <?php View::GenerateButton($Libellé, "btn btn-primary", "", $ID, $Name); ?>

</form>