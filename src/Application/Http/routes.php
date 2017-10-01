<?php

use Wouterds\Application\Http\Application;
use Wouterds\Application\Http\Handlers\HomeHandler;
use Wouterds\Application\Http\Middlewares\TwigMiddleware;

/** @var Application $app */

// Routes that'll render Twig templates
$app->group(null, function () use ($app) {
    $app->get('/', HomeHandler::class)->setName('home');
})->add(TwigMiddleware::class);
