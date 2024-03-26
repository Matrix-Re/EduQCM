<?php

require_once './Views/View.php';

/**
 * Class Home
 *
 * This class is used to display the home page of the application.
 */
class Home extends View
{

    /**
     * Constructor of the class.
     *
     * @param array $Data The data for the home page display.
     */
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
