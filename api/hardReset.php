<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $route = $_REQUEST['route'];
    $master = getStandMaster(str_replace($main_route, '', $route));

    $output = shell_exec('cd ' . $route . ' && git reset --hard origin/' . $master . ' && git checkout ' . $master . ' && composer install 2>&1');

    if(is_in_str($output, "Your branch is up to date with 'origin/" . $master . "'")){
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
    exit;