<?php

use Wouterds\Application\Http\Application;

// Application directory
define('APP_DIR', dirname(__DIR__));

// Composer autoloader
require_once(APP_DIR . '/vendor/autoload.php');

// Create new http app
$app = new Application();

// Run http app
$app->run();
