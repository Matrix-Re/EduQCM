<table class="table table-bordered">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Type</th>
            <th>Affectation</th>
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
                    <td><?= "Formateur" ?></td>
                    <td> <input type="checkbox" value="<?= $IdUtilisateur ?>" name="AffectationQCMIdUtilisateur[]"> </td>
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
                    <td><?=  $IdUtilisateur ?></td>
                    <td><?= $Elève->__get("Nom") ?></td>
                    <td><?= $Elève->__get("Prénom") ?></td>
                    <td><?= "Elève" ?></td>
                    <td> <input type="checkbox" value="<?= $IdUtilisateur ?>" name="AffectationQCMIdUtilisateur[]"> </td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>