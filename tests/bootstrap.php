<?php

use Dotenv\Dotenv;

define('PHPUNIT', true);
define('APP_DIR', dirname(__DIR__));

require_once APP_DIR . '/vendor/autoload.php';


// Init dotenv
$dotenv = new Dotenv(APP_DIR);

// Load env variables at runtime
$dotenv->overload();
