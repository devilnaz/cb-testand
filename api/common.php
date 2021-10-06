<?php

// Настраиваем глобальные переменные
// TODO: от глобальных переменных надлежит избавиться, перейдя либо на функцию config(), либо на DI-контейнер
$main_route = config('root');
$stands_master = config('masters');

function getStandMaster($name)
{
    global $stands_master;

    return $stands_master[$name] ?: 'master';
}

function is_in_str($str, $substr) 
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
        $config = \json_decode((\file_get_contents('../config/config.json') ?: '{ "masters": {}, "root": "../" }'), true);
    }

    return $config[$name];
}
