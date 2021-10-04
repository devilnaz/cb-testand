<?php
    header("Access-Control-Allow-Origin: *");
    require_once(__DIR__ . '/common.php');
    $result = array();
    $files = glob($main_route . 'ts_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => $stands_master[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($main_route . 'tsdb_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => $stands_master[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($main_route . 'jiglipuf*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => $stands_master[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($main_route . 'master*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => $stands_master[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }

    echo json_encode($result);
?>