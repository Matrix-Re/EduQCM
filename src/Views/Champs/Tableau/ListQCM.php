<table class="table table-bordered">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Thème</th>
            <th>Libellé</th>
            <th>Affecté le</th>
            <th>Note</th>
            <th>Effectué le</th>
            <th>Synthèse</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if (!empty($ListQCM)) {
            foreach ($ListQCM as $QCM) {
                if ($QCM["DateRéalisation"] != 0) {
                    if ($QCM["Note"] == 0) {
                        $Note = "0 / 20";
                    }
                    else {
                        $Note = $QCM["Note"] . " / 20";
                    }
                }else {
                    $Note = "";
                }                
                ?>            
                <tr>
                    <td><?= $QCM["IdQCM"] ?></td>
                    <td><?= $QCM["Description"] ?></td>
                    <td><?= $QCM["LibelléQCM"] ?></td>
                    <td><?= $QCM["DateAffectation"] ?></td>
                    <td><?= $Note ?></td>

                    <?php if ($QCM["DateRéalisation"] != null) { ?>
                        <td><?= $QCM["DateRéalisation"] ?></td>
                        <td> <?php View::GenerateButton("Afficher", "", "", $QCM["IdRésultat"], "AfficherQCM") ?> </td>
                    <?php } else { ?>
                        <td> <?php View::GenerateButton("Réaliser", "", "", $QCM["IdRésultat"], "RéaliserQCM") ?> </td>
                        <td></td>
                    <?php } ?>
                    
                </tr>

        <?php }
        } ?>
    </tbody>
</table>