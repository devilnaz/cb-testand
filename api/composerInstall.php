<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $route = $_REQUEST['route'];

    $output = shell_exec('cd ' . $route . composer_install());

    if(!isInStr($output, "ErrorException")){
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
