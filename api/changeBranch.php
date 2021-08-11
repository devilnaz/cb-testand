<?php
    header("Access-Control-Allow-Origin: *");

    function is_in_str($str, $substr) {
        $result = strpos($str, $substr);
        if ($result === FALSE) // если это действительно FALSE, а не ноль, например 
            return false;
        else
            return true;   
    }

    $branch = quotemeta(trim($_REQUEST['branch']));
    $_branch = trim($_REQUEST['branch']);
    $route = $_REQUEST['route'];
    $clear = $_REQUEST['clear'];
    if($clear == 1){
        $output = shell_exec('cd ' . $route . ' && git checkout master && git pull');
        $output2 = shell_exec('cd ' . $route . ' && git branch -D ' . $branch);
        /*var_dump($output);
        var_dump($output2);*/
        if(is_in_str($output, "Your branch is") && (is_in_str($output2, "Deleted") || is_in_str($output2, "branch"))){
            echo json_encode([
                "ok" => true,
                "branch_name" => "master" 
            ]);
        }
        else {
            echo json_encode([
                "ok" => false 
            ]);
        }
        exit;
    } else {
        $output = shell_exec('cd ' . $route . ' && git checkout master 2>&1'); //"Your branch is"
        $output2 = shell_exec('cd ' . $route . ' && git pull -a 2>&1'); //Already || remote
        $output3 = shell_exec('cd ' . $route . ' && git checkout -b testand-' . $branch . ' 2>&1'); //Switched
        $output4 = shell_exec('cd ' . $route . ' && git merge --commit -m "testand-' . $branch . '" origin/' . $branch . ' 2>&1'); //Merge || Already
        /*var_dump($output);
        var_dump($output2);
        var_dump($output3);
        var_dump($output4);*/
        if(
            is_in_str($output, "Your branch is") &&
            (is_in_str($output2, "Already") || is_in_str($output2, "remote") || is_in_str($output2, "Updating") || is_in_str($output2, "Fast-forward")) && 
            (is_in_str($output3, "Switched") && !is_in_str($output3, "fatal")) &&
            (is_in_str($output4, "Merge") || is_in_str($output4, "Already") || is_in_str($output4, "changed") || is_in_str($output4, "Updating")) && !is_in_str($output4, "conflict")  && !is_in_str($output4, " error ") && !is_in_str($output4, "not something")
        ){
            echo json_encode([
                "ok" => true,
                "branch_name" => "testand-" . $_branch 
            ]);
        }
        else {
            $log = $output . " ::::: " . $output2 . " ::::: " . $output3 . " ::::: " . $output4;
            $text_error = "Ошибка при размещении ветки! Стенд сброшен до master'а!";
            if(is_in_str($output4, "conflict")){
                $text_error = "Возник конфликт при замещении ветки. Стенд сброшен до master'а!";
                $output = shell_exec('cd ' . $route . ' && git merge --abort');
            }

            $output2 = shell_exec('cd ' . $route . ' && git checkout master && git pull');
            $output3 = shell_exec('cd ' . $route . ' && git branch -D testand-' . $branch);
            echo json_encode([
                "ok" => false,
                "error" => $text_error,
                "log" => $log
            ]);
        }
        exit;
    }

    