<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $route = $_REQUEST['route'];
    $master = getStandMaster(str_replace(config('root'), '', $route));

    $output = shell_exec('cd ' . $route . ' && git reset --hard origin/' . $master . ' && git checkout ' . $master . composer_install());

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
    exit;
