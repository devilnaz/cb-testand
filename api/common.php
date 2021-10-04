<?php
    $stands_master = json_encode((file_get_contents('./config.json') ?: "{ 'masters': {} }"), true)['masters'] ?: [];

    function is_in_str($str, $substr) {
        $result = strpos($str, $substr);
        if ($result === FALSE) // если это действительно FALSE, а не ноль, например 
            return false;
        else
            return true;   
    }