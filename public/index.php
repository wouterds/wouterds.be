<?php

use Dotenv\Dotenv;
use Tracy\Debugger;
use WouterDeSchuyter\Application\Http\Application;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;

// Boot time
$bootTime = microtime(true);

// Application directory
define('APP_DIR', dirname(__DIR__));

// Include composer autoloader
require_once APP_DIR . '/vendor/autoload.php';

// Debugger mode
$debuggerMode = in_array(getenv('APP_ENV'), ['production', 'staging']) ? Debugger::PRODUCTION : Debugger::DEVELOPMENT;

// Debugger
Debugger::$showBar = $debuggerMode === Debugger::DEVELOPMENT;
Debugger::$strictMode = $debuggerMode === Debugger::DEVELOPMENT;
Debugger::enable($debuggerMode, APP_DIR . '/storage/logs');

if (file_exists(APP_DIR . '/.env')) {
    (new Dotenv(APP_DIR))->overload();
}

// Init http app
$app = new Application();

// Application monitor
$applicationMonitor = $app->getContainer()->get(ApplicationMonitor::class);
$applicationMonitor->setBootTime($bootTime);

// Run http app
$app->run();
