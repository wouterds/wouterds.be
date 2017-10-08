<?php

use Dotenv\Dotenv;
use Wouterds\Application\Http\Application;

// Application directory
define('APP_DIR', dirname(__DIR__));

// Composer autoloader
require_once(APP_DIR . '/vendor/autoload.php');

// Init dotenv
$dotenv = new Dotenv(APP_DIR);

// Overload env variables at runtime
$dotenv->overload();

// Init http app
$app = new Application();

// Run http app
$app->run();
