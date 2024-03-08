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
        <!-- PARTIE ENSEIGNANT -->
        <?php
        if (!empty($ListEnseignant)) {
            foreach ($ListEnseignant as $Enseignant) {
                $IdUtilisateur = $Enseignant->__get("IdUtilisateur");
                ?>
                <tr>
                    <td><?= $IdUtilisateur ?></td>
                    <td><?= $Enseignant->__get("Nom") ?></td>
                    <td><?= $Enseignant->__get("Prénom") ?></td>
                    <td><?= $Enseignant->__get("Login") ?></td>
                    <td><?= $Enseignant->__get("MotDePasse") ?></td>
                    <td><?= "Formateur" ?></td>
                    <td><?= 1 ?></td>
                    <td><?= 1 ?></td>
                </tr>

        <?php }
        } ?>
        <!-- PARTIE ELÈVE -->
        <?php
        if (!empty($ListElève)) {
            foreach ($ListElève as $Elève) { 
                $IdUtilisateur = $Elève->__get("IdUtilisateur");
                ?>
                <tr>
                    <td><?= $IdUtilisateur ?></td>
                    <td><?= $Elève->__get("Nom") ?></td>
                    <td><?= $Elève->__get("Prénom") ?></td>
                    <td><?= $Elève->__get("Login") ?></td>
                    <td><?= $Elève->__get("MotDePasse") ?></td>
                    <td><?= "Elève" ?></td>
                    <td><?= 1 ?></td>
                    <td><?= 1 ?></td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>