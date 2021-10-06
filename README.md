# Light Test Stands

### При изменении master-ветки у стенда <u>необходимо выполнить</u> набор следующих **git-команд**:

```
    cd */path/to/ts/*
    git reset --hard origin/*current_master*
    git checkout *current_master*
    composer install
```