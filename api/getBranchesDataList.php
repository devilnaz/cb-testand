<?php
    header("Access-Control-Allow-Origin: *");
    
    $route = $_REQUEST['route'];
    $fetch_command = shell_exec('cd ' . $route . ' && git fetch --all');
    $all_branches = trim(shell_exec('cd ' . $route . ' && git branch -r  2>&1'));

    $result = [];

    foreach(explode("\n", $all_branches) as $branch){
        $result[] = trim(str_replace("origin/", "", $branch));
    }

    echo json_encode([
        "branches" => $result,
        "log" => $all_branches
    ]);