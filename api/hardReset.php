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

    $output = shell_exec('cd ' . $route . ' && git reset --hard origin/master && git checkout master && composer install 2>&1');

    if(is_in_str($output, "Your branch is up to date with 'origin/master'")){
        echo json_encode([
            "ok" => true,
            "branch_name" => "master" 
        ]);
    }
    else {
        echo json_encode([
            "ok" => false 
        ]);
    }
    exit;