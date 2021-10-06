<?php
    header("Access-Control-Allow-Origin: *");
    require_once(__DIR__ . '/common.php');
    $result = array();
    $files = glob(config('root') . 'ts_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => config('masters')[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob(config('root') . 'tsdb_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => config('masters')[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob(config('root') . 'jiglipuf*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => config('masters')[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob(config('root') . 'master*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
        'master' => config('masters')[basename($file)] ?: 'master',
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }

    echo json_encode($result);
?>