<table class="table table-bordered">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Login</th>
            <th>Mot de passe</th>
            <th>Type</th>
            <th>Modification</th>
            <th>Suppression</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if (!empty($ListCompte)) {
            foreach ($ListCompte as $Utilisateur) {
                $IdUtilisateur = $Utilisateur->getIdUtilisateur();
                if (get_class($Utilisateur) == "Enseigant") {
                    $TypeUser = "Formateur";
                } else {
                    $TypeUser = get_class($Utilisateur);
                }
        ?>
                <tr>
                    <td><?= $IdUtilisateur ?></td>
                    <td><?= $Utilisateur->getNom() ?></td>
                    <td><?= $Utilisateur->getPrénom() ?></td>
                    <td><?= $Utilisateur->getLogin() ?></td>
                    <td><?= $Utilisateur->getMotDePasse() ?></td>
                    <td><?= $TypeUser ?></td>
                    <td> <?= View::GenerateButton("Modifier", "", "GestionDesComptes/Compte/" . $IdUtilisateur) ?> </td>
                    <td> <?= View::GenerateButton("Supprimer", "", "", $IdUtilisateur, "SuppressionCompte") ?> </td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>