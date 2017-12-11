<?php

use WouterDeSchuyter\Application\Http\Handlers\HomeHandler;

$app->group(null, function () use ($app) {
    $app->get('/', HomeHandler::class)->setName('home');
});
