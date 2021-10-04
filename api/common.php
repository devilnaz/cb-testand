<?php
    $main_route = "../../"; //здесь необходимо прописать путь до папки, где лежат стенды, относительного данного файла
    $stands_master = json_decode((file_get_contents('./config.json') ?: "{ 'masters': {} }"), true)['masters'] ?: [];

    function getStandMaster($name){
        return $stands_master[$name] ?: 'master';
    }

    function is_in_str($str, $substr) {
        $result = strpos($str, $substr);
        if ($result === FALSE) // если это действительно FALSE, а не ноль, например 
            return false;
        else
            return true;   
    }