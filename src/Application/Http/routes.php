<?php

use WouterDeSchuyter\Application\Http\Handlers\AboutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Blog\DetailHandler as BlogDetailHandler;
use WouterDeSchuyter\Application\Http\Handlers\Blog\IndexHandler as BlogIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\HomeHandler;
use Slim\App;

function AMPCompatibleRoutes(App $app, $amp = false)
{
    $suffix = $amp ? ':amp' : '';

    $app->get('/', HomeHandler::class)->setName('home' . $suffix);
    $app->get('/about', AboutHandler::class)->setName('about' . $suffix);
    $app->group('/blog', function () use ($app, $suffix) {
        $app->get('', BlogIndexHandler::class)->setName('blog' . $suffix);
        $app->get('/{slug}', BlogDetailHandler::class)->setName('blog.detail' . $suffix);
    });
    $app->get('/contact', ContactHandler::class)->setName('contact' . $suffix);
}

$app->group(null, function () use ($app) {
    AMPCompatibleRoutes($app);
    $app->group('/amp', function () use ($app) {
        AMPCompatibleRoutes($app, true);
    });

    $app->post('/contact.json', ContactPostHandler::class)->setName('contact_post');

    // Admin routes
    require_once __DIR__ . '/routes-admin.php';
});
