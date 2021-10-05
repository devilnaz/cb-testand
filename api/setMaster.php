<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $name = $_REQUEST['name'];
    $master = $_REQUEST['master'];
    $code = $_REQUEST['code'];

    if($code === "qrwe1432"){
        global $stands_master;

        $stands_master[$name] = $master;

        file_put_contents(__DIR__ . '/config.json', json_encode([ "masters" => $stands_master ], JSON_PRETTY_PRINT));
    }

    echo 1;
    exit;