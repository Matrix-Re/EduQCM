<?php

class Router{

     public function routeReq(){
          // Initialisation
          $url = [''];

          // On récupère le première paramètre avant le /
          if (isset($_GET['url'])) {
               $url = explode('/', $_GET['url']);
          }

          // On récupère le paramètre url saisir après le nom de la page
          $parametre = $url;
          if(!empty($parametre[1])){
               array_shift($parametre);                       
               $GLOBALS['paramterUrl'] = $parametre;
          } 

          // On défénit le controller à appeller
          $controller = "Controller".ucfirst(strtolower($url[0]));

          if(!empty($url[0])){
               $controllerRepertory = "Controllers/" . $controller . ".php";
               if(file_exists($controllerRepertory)) 
               {
                    require($controllerRepertory);
                    $MonController = new $controller();
               }
               else{ 
                    echo "Page introuvable"; 
               }
          }else{
               require("Controllers/ControllerConnexion.php");
               $controller = new ControllerConnexion();
          }

     }

}