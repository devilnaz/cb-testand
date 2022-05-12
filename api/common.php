<?php

/**
 * Получить master-ветку для стенда (по имени стенда(папки))
 *
 * @param string $name имя стенда (название его папки)
 * @return string master-ветка стенда
 */
function getStandMaster(string $name): string
{
    return config('masters')[$name] ?: 'master';
}

/**
 * Функция проверки вхождения подстроки в строку
 *
 * @param string $str    строка
 * @param string $substr подстрока
 * @return bool
 */
function isInStr(string $str, string $substr): bool
{
    $result = strpos($str, $substr);
    if ($result === FALSE) // если это действительно FALSE, а не ноль, например
        return false;
    else
        return true;
}

/**
 * Получить значение конфигурационного параметра
 *
 * @param string $name  имя параметра
 * @return mixed        значение параметра
 */
function config(string $name)
{
    static $config = null;

    if (is_null($config)) {
        $config = \json_decode((\file_get_contents('../config/config.json') ?: '{ "masters": {}, "root": "../../" }'), true);
    }

    return $config[$name];
}

/**
 *
 */
function changeBranch(string $route, string $branch, bool $clear): array
{
    $branch = quotemeta(trim($branch));
    $_branch = trim($branch);
    $master = getStandMaster(str_replace(config('root'), '', $route));

    if($clear){
        $output = shell_exec('cd ' . $route . ' && git checkout ' . $master . ' && git pull');
        $output2 = shell_exec('cd ' . $route . ' && git branch -D ' . $branch);
        /*var_dump($output);
        var_dump($output2);*/
        if(isInStr($output, "Your branch is") && (isInStr($output2, "Deleted") || isInStr($output2, "branch"))){
            return [
                "ok" => true,
                "branch_name" => $master
            ];
        }
        else {
            return [
                "ok" => false
            ];
        }
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
            return [
                "ok" => true,
                "branch_name" => "testand-" . $_branch
            ];
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
            return [
                "ok" => false,
                "error" => $text_error,
                "log" => $log
            ];
        }
    }
}

function composer_install()
{
    return ' && composer install 2>&1 && for DIR in modules/clientbase/*/; do if [ -e $DIR/composer.json ]; then composer install --working-dir "$DIR" 2>&1; fi; done';
}

function composer_update()
{
    return ' && composer update 2>&1 && for DIR in modules/clientbase/*/; do if [ -e $DIR/composer.json ]; then composer update --working-dir "$DIR" 2>&1; fi; done';
}
