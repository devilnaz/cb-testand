# Light Test Stands

### При изменении master-ветки у стенда <u>необходимо выполнить</u> набор следующих **git-команд**:

```
    cd */path/to/ts/*
    git reset --hard origin/*current_master*
    git checkout *current_master*
    composer install
```

### При первом запуске проекта необходимо создать файл config/config.json

Пример:
```
{
    "root": "../",
    "masters": {
        "ts_01": "master",
        "ts_02": "master",
        "ts_03": "master",
        "ts_04": "master",
        "ts_05": "master",
        "ts_06": "master",
        "ts_marat_01": "master",
        "ts_marat_02": "master",
        "tsdb_01": "master",
        "tsdb_02": "master",
        "tsdb_03": "master",
        "tsdb_cron_01": "master",
        "tsdb_cron_02": "master"
    }
}
```

### Чтобы добавить информацию по стендам перейдите в info/markdown.md