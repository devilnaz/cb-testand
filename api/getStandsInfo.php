<?php
    header("Access-Control-Allow-Origin: *");
    $result = array();
    $route = "../../"; //здесь необходимо прописать путь до папки, где лежат стенды, относительного данного файла
    $files = glob($route . 'ts_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($route . 'tsdb_*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($route . 'jiglipuf*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }
    $files = glob($route . 'master*', GLOB_ONLYDIR);
    foreach($files as $file) {
        $result[] = [
	    'name' => basename($file),
	    'route' => $file,
	    'branch' => trim(shell_exec('cd ' . $file . ' && git rev-parse --abbrev-ref HEAD')),
        ];
    }

    echo json_encode($result);
?>