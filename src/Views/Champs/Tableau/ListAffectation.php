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
        <?php
        if (!empty($ListUtilisateur)) {    
            foreach ($ListUtilisateur as $Utilisateur) {
                $IdUtilisateur = $Utilisateur->getIdUtilisateur();
                if (get_class($Utilisateur) == "Enseigant") {
                    $TypeUser = "Formateur";
                }else{
                    $TypeUser = get_class($Utilisateur);
                }            
                ?>
                <tr>
                    <td><?= $IdUtilisateur ?></td>
                    <td><?= $Utilisateur->getNom() ?></td>
                    <td><?= $Utilisateur->getPrénom() ?></td>
                    <td><?= $TypeUser ?></td>
                    <td> <input type="checkbox" value="<?= $IdUtilisateur ?>" name="AffectationQCMIdUtilisateur[]"> </td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>