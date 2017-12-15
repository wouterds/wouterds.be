<?php

define('PHPUNIT', true);
define('APP_DIR', dirname(__DIR__));

require_once APP_DIR . '/vendor/autoload.php';

if (file_exists(APP_DIR . '/.env')) {
    (new \Dotenv\Dotenv(APP_DIR))->overload();
}
