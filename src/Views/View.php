<?php

abstract class View
{

    public static function GenerateButton($Libellé,$Style,$Link = "",$ID = "", $Name = ""){
        if (!empty($ID)) { 
            // echo "<form method='POST'>
            //         <input class='$Style' type='submit' id='$ID' name='$ID' value='$Libellé'>                    
            //     </form>";

            echo "<form method='POST'>
            <button type='submit' class='$Style' id='$ID' value='$ID' name='$Name'>$Libellé</button>
            </form>";

        } else { 
            echo "<a class='$Style' href='$Link'>$Libellé</a>";
        }
    }

}

?>