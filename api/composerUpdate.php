<?php
    header("Access-Control-Allow-Origin: *");

    function is_in_str($str, $substr) {
        $result = strpos($str, $substr);
        if ($result === FALSE) // если это действительно FALSE, а не ноль, например 
            return false;
        else
            return true;   
    }

    $route = $_REQUEST['route'];

    $output = shell_exec('cd ' . $route . ' && composer update 2>&1');

    if(!is_in_str($output, "ErrorException")){
        echo json_encode([
            "ok" => true,
            "log" => $output,
        ]);
    }
    else {
        echo json_encode([
            "ok" => false,
            "log" => $output,
        ]);
    }
    exit;