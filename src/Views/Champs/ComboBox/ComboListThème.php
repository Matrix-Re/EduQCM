<div class="d-flex">
    <p>Sélection d'un Thème :</p>

    <select name="ComboBoxIdThème">
        <?php
        if (isset($ListThème)) {
            foreach ($ListThème as $thème) {                
        ?>

                <option value="<?= $thème->getIdThème() ?>"> <?= $thème->getDescription() ?> </option>
        <?php }
        } ?>
    </select>
</div>