<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    echo json_encode(changeBranch($_REQUEST['route'], $_REQUEST['branch'], $_REQUEST['clear'] == 1));
    exit;
    
    

    