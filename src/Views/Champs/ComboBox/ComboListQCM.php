<div class="d-flex">
    <p>Sélection d'un QCM :</p>

    <select name="ComboBoxIdQCM">
        <?php
        if (isset($ListQCM)) {
            foreach ($ListQCM as $qcm) {
                $Thème = new Thème($qcm->getIdThème());
                $NomThème = $Thème->getDescription();
        ?>

                <option value="<?= $qcm->getIdQCM() ?>"> <?= $NomThème . " : " . $qcm->getLibelléQCM() ?> </option>
        <?php }
        } ?>
    </select>
</div>