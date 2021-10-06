<?php
    header("Access-Control-Allow-Origin: *");

    require_once(__DIR__ . '/common.php');

    $branch = quotemeta(trim($_REQUEST['branch']));
    $_branch = trim($_REQUEST['branch']);
    $route = $_REQUEST['route'];
    $clear = $_REQUEST['clear'];
    $master = getStandMaster(str_replace(config('root'), '', $route));
    if($clear == 1){
        $output = shell_exec('cd ' . $route . ' && git checkout ' . $master . ' && git pull');
        $output2 = shell_exec('cd ' . $route . ' && git branch -D ' . $branch);
        /*var_dump($output);
        var_dump($output2);*/
        if(isInStr($output, "Your branch is") && (isInStr($output2, "Deleted") || isInStr($output2, "branch"))){
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
    } else {
        $output = shell_exec('cd ' . $route . ' && git checkout ' . $master . ' 2>&1'); //"Your branch is"
        $output2 = shell_exec('cd ' . $route . ' && git pull -a 2>&1'); //Already || remote
        $output3 = shell_exec('cd ' . $route . ' && git checkout -b testand-' . $branch . ' 2>&1'); //Switched
        $output4 = shell_exec('cd ' . $route . ' && git merge --commit -m "testand-' . $branch . '" origin/' . $branch . ' 2>&1'); //Merge || Already
        /*var_dump($output);
        var_dump($output2);
        var_dump($output3);
        var_dump($output4);*/
        if(
            isInStr($output, "Your branch is") &&
            (isInStr($output2, "Already") || isInStr($output2, "remote") || isInStr($output2, "Updating") || isInStr($output2, "Fast-forward")) && 
            (isInStr($output3, "Switched") && !isInStr($output3, "fatal")) &&
            (isInStr($output4, "Merge") || isInStr($output4, "Already") || isInStr($output4, "changed") || isInStr($output4, "Updating")) && !isInStr($output4, "conflict")  && !isInStr($output4, " error ") && !isInStr($output4, "not something")
        ){
            echo json_encode([
                "ok" => true,
                "branch_name" => "testand-" . $_branch 
            ]);
        }
        else {
            $log = $output . " ::::: " . $output2 . " ::::: " . $output3 . " ::::: " . $output4;
            $text_error = "Ошибка при размещении ветки! Стенд сброшен до master'а!";
            if(isInStr($output4, "conflict")){
                $text_error = "Возник конфликт при замещении ветки. Стенд сброшен до master'а!";
                $output = shell_exec('cd ' . $route . ' && git merge --abort');
            }

            $output2 = shell_exec('cd ' . $route . ' && git checkout ' . $master . ' && git pull');
            $output3 = shell_exec('cd ' . $route . ' && git branch -D testand-' . $branch);
            echo json_encode([
                "ok" => false,
                "error" => $text_error,
                "log" => $log
            ]);
        }
        exit;
    }

    