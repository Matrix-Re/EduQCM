<?php

/**
 * Class Controller
 *
 * This class is used to manage views and popups in the application.
 */
abstract class Controller{

    /**
     * Render a view.
     *
     * @param string $NameView The name of the view to render.
     * @param string $NomPage The name of the page.
     * @param array $Data The data to pass to the view. Default is an empty array.
     */
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

    /**
     * Render a view.
     *
     * @param string $NameView The name of the view to render.
     * @param string $NomPage The name of the page.
     * @param array $Data The data to pass to the view. Default is an empty array.
     */
    public static function Message($PopupTitle,$PopupMessage){
        ob_start();
        $typePopup = "popupInformation";
        require 'Views/Popup/popupInformation.php';
        $PopupContent = ob_get_clean();
        require 'Views/Popup/ModalPopup.php';
    }
    
}
