<?php

abstract class Controller{

    public static function Render($NameView, $NomPage, $Data = [""]){              
        if(file_exists("Views/$NameView.php"))
        {
            ob_start();
            $title = $NomPage;
            require "Views/$NameView.php";
            $View = new $NameView($Data);
            $content = ob_get_clean();
            require 'Views/layout.php';
        }else {
            require 'Views/Error.php';
        }                
    }

    public static function Message($PopupTitle,$PopupMessage){
        ob_start();
        $typePopup = "popupInformation";
        require 'Views/Popup/popupInformation.php';
        $PopupContent = ob_get_clean();
        require 'Views/Popup/ModalPopup.php';
    }
    
}
