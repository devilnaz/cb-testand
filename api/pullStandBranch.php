<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    if(changeBranch($_REQUEST['route'], 'testand-' . $_REQUEST['branch'], true)['ok']){
        if(changeBranch($_REQUEST['route'], $_REQUEST['branch'], false)['ok']){
            echo json_encode([
                "ok" => true, 
            ]);
            exit;
        }
    }

    echo json_encode([
        "ok" => false 
    ]);
    exit;

    