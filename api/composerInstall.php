<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $route = $_REQUEST['route'];

    $output = shell_exec('cd ' . $route . ' && composer install 2>&1');

    if(!isInStr($output, "ErrorException")){
        echo json_encode([
            "ok" => true
        ]);
    }
    else {
        echo json_encode([
            "ok" => false 
        ]);
    }
    exit;