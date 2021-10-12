<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    echo json_encode(changeBranch($_REQUEST['route'], $_REQUEST['branch'], $_REQUEST['clear'] == 1));
    exit;
    
    

    