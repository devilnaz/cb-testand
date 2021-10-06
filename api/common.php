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
        $config = \json_decode((\file_get_contents('../config/config.json') ?: '{ "masters": {}, "root": "../" }'), true);
    }

    return $config[$name];
}
