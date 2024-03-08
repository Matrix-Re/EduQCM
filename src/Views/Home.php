<?php

require_once './Views/View.php';
class Home extends View
{

     public function __construct($Data = [""])
     {
          extract($Data);
          require "./Views/Champs/Header.php";

?>
          <div class="d-flex align-items-center justify-content-center">
               <div class="text-center">
                    <h2>Bienvenue sur l'application QCM</h2>
                    <img src="./Views/Picture/QCM_Illustration.png" width="500">
               </div>
          </div>

<?php


     }
}
