<table class="table table-bordered">
     <thead>
          <tr>
               <th>Question N°</th>
               <th>Validée</th>
               <th>Points</th>
          </tr>
     </thead>
     <tbody>
          <?php
          $Indice = 0;
          foreach ($Resultat->Détails() as $Question) {
               $Indice++;
               if($Question){
                    $Validée = "Oui";
               }else{
                    $Validée = "Non";
               }
          ?>
               <tr>
                    <td><?= $Indice ?></td>
                    <td><?= $Validée ?></td>
                    <td><?= $Question ?></td>
               </tr>

          <?php } ?>
     </tbody>
</table>

<div class="d-lg-inline-flex">
     <table class="table table-bordered">
          <tr>
               <th>Note</th>
               <td><?= $Resultat->getNote() ?> / 20</td>
          </tr>
     </table>

     <table class="table table-bordered">
          <tr>
               <th>Réalisé</th>
               <td><?= $Resultat->getNote() * 5 ?>%</td>
          </tr>
     </table>
</div>