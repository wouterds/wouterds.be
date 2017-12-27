<?php

use WouterDeSchuyter\Application\Http\Handlers\AboutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Blog\DetailHandler as BlogDetailHandler;
use WouterDeSchuyter\Application\Http\Handlers\Blog\IndexHandler as BlogIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\HomeHandler;

$app->group(null, function () use ($app) {
    $app->get('/', HomeHandler::class)->setName('home');
    $app->get('/about', AboutHandler::class)->setName('about');
    $app->group('/blog', function () use ($app) {
        $app->get('', BlogIndexHandler::class)->setName('blog');
        $app->get('/{slug}', BlogDetailHandler::class)->setName('blog.detail');
    });
    $app->get('/contact', ContactHandler::class)->setName('contact');
    $app->post('/contact.json', ContactPostHandler::class)->setName('contact_post');

    // Admin routes
    require_once __DIR__ . '/routes-admin.php';
});
