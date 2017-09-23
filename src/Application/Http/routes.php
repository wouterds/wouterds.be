<?php

use Wouterds\Application\Http\Application;
use Wouterds\Application\Http\Handlers\HomeHandler;

/** @var Application $app */

$app->get('/', HomeHandler::class)->setName('home');
