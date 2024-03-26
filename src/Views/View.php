<?php

/**
 * Class View
 *
 * This class is used to generate buttons in the application.
 */
abstract class View
{

    /**
     * Generate a button.
     *
     * @param string $Libellé The label of the button.
     * @param string $Style The style of the button.
     * @param string $Link The link of the button. Default is an empty string.
     * @param string $ID The ID of the button. Default is an empty string.
     * @param string $Name The name of the button. Default is an empty string.
     */
    public static function GenerateButton($Libellé,$Style,$Link = "",$ID = "", $Name = ""){
        if (!empty($ID)) {
            echo "<form method='POST'>
            <button type='submit' class='$Style' id='$ID' value='$ID' name='$Name'>$Libellé</button>
            </form>";
        } else { 
            echo "<a class='$Style' href='$Link'>$Libellé</a>";
        }
    }

}

?>