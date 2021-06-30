<?php
    header("Access-Control-Allow-Origin: *");
    $result = array();
    
    $route = $_REQUEST['route'];
    $branch = trim(shell_exec('cd ' . $route . ' && git rev-parse --abbrev-ref HEAD'));

    echo json_encode([
        "branch" => $branch
    ]);
?>