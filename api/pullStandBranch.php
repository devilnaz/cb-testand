<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');
    
    $route = $_REQUEST['route'];
    $output = shell_exec('cd ' . $route . ' && git pull 2>&1');
    if(isInStr($output, "Already up to date.")){
        echo json_encode([
            "ok" => true, 
        ]);
    }
    else {
        echo json_encode([
            "ok" => false 
        ]);
    }
    exit;

    