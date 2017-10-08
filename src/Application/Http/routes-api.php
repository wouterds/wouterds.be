<?php

use Wouterds\Application\Http\Handlers\Api\Admin\AdminSignUpHandler;

$app->group('/api', function () use ($app) {

    $app->group('/admin', function () use ($app) {
        $app->post('/sign-up', AdminSignUpHandler::class)->setName('api.admin.sign-up');
    });

});
