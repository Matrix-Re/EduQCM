<table class="table table-bordered">
    <thead>
        <tr>
            <th>Identifiant</th>
            <th>Thème</th>
            <th>Libellé</th>
            <th>Auteur</th>
            <th>Suppression</th>
        </tr>
    </thead>
    <tbody>
        <?php
        if (!empty($ListQCM)) {

          require './Models/ModelUtilisateur.php';

            foreach ($ListQCM as $QCM) {
                $IdQCM = $QCM->getIdQCM();

                $thème = new Thème($QCM->getIdThème());
                $Description = $thème->getDescription();

                $user = new Utilisateur($QCM->getIdAuteur());
                $Auteur = $user->getPrénom() . " " . $user->getNom();
                ?>
                <tr>
                    <td><?= $IdQCM ?></td>
                    <td><?= $Description ?></td>
                    <td><?= $QCM->getLibelléQCM() ?></td>
                    <td><?= $Auteur ?></td>

                    <td> <input type="checkbox" value="<?= $IdQCM ?>" name="SuppressionQCMIdQCM[]"> </td>
                </tr>

        <?php }
        } ?>
    </tbody>
</table>