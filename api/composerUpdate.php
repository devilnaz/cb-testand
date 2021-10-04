<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

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