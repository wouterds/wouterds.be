<?php

require_once('./vendor/autoload.php');

return [
    'dbname' => getenv('MYSQL_DATABASE'),
    'user' => getenv('MYSQL_USER'),
    'password' => getenv('MYSQL_PASSWORD'),
    'host' => getenv('MYSQL_HOST'),
    'port' => getenv('MYSQL_PORT'),
    'driver' => 'pdo_mysql',
    'defaultDatabaseOptions' => [
        'charset' => 'utf8mb4',
        'collate' => 'utf8mb4_unicode_ci'
    ],
    'defaultTableOptions' => [
        'charset' => 'utf8mb4',
        'collate' => 'utf8mb4_unicode_ci'
    ],
];
