<table class="table table-bordered">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Moyenne</th>
            <th>Disponibles</th>
            <th>Réalisés</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if (!empty($ListRésultat)) {
            foreach ($ListRésultat as $Utilisateur) {
                $Disponibles = 0;
                $Réalisés = 0;
                $Moyenne = "";
                if (!empty($Utilisateur["MoyenneQCM"])) {
                    $Moyenne = $Utilisateur["MoyenneQCM"] . " / 20";
                }
                if (!empty($Utilisateur["Disponible"])) {
                    $Disponibles = $Utilisateur["Disponible"];
                }
                if (!empty($Utilisateur["NbQCMRéalisés"])) {
                    $Réalisés = $Utilisateur["NbQCMRéalisés"];
                }
        ?>
                <tr>
                    <td><?= $Utilisateur["IdUtilisateur"] ?></td>
                    <td><?= $Utilisateur["Nom"] ?></td>
                    <td><?= $Utilisateur["Prénom"] ?></td>
                    <td><?= $Moyenne ?></td>
                    <td><?= $Disponibles ?></td>
                    <td><?= $Réalisés ?></td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>