<?php

use Wouterds\Application\Http\Handlers\HomeHandler;

$app->get('/', HomeHandler::class)->setName('home');
