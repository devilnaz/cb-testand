<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $name = $_REQUEST['name'];
    $master = $_REQUEST['master'];
    $code = $_REQUEST['code'];

    if($code === "qrwe1432"){
        $stands_master = config('masters');

        $stands_master[$name] = $master;

        file_put_contents(__DIR__ . '../config/config.json', json_encode([ "masters" => $stands_master ], JSON_PRETTY_PRINT));

        $route = config('root') . $name;

        $output = shell_exec('cd ' . $route . ' && git reset --hard origin/' . $master . ' && git checkout ' . $master . ' && composer install 2>&1');

        if(isInStr($output, "Your branch is up to date with 'origin/" . $master . "'")){
            echo json_encode([
                "ok" => true,
                "branch_name" => $master 
            ]);
        }
        else {
            echo json_encode([
                "ok" => false 
            ]);
        }
    }
    
    exit;