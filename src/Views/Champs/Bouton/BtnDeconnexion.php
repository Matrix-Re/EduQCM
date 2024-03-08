<form method="POST">
     <input class="btn btn-light" type="submit" name="Déconnexion" value="Déconnexion">
</form>


<?php
// class href value name id

$Style = "";
$Link = "";
$Libellé = "";
$ID = "";

if (!empty($ID)) { ?>
     <form method="POST">
          <input class="<?= $Style ?>" type="submit" id="<?= $ID ?>" name="<?= $ID ?>" value="<?= $Libellé ?>">
     </form>
<?php } else { ?>
     <a class="<?= $Style ?>" href="<?= $Link ?>"><?= $Libellé ?></a>
<?php } ?>