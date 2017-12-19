<?php

use WouterDeSchuyter\Application\Http\Handlers\AboutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\MediaHandler as AdminMediaHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\OverviewHandler as AdminOverviewHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignInHandler as AdminUsersSignInHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignInPostHandler as AdminUsersSignInPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignOutHandler as AdminUsersSignOutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\SignUpHandler as AdminSignUpHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\SignUpPostHandler as AdminSignUpPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\ActivateHandler as AdminUsersActivateHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\DeactivateHandler as AdminUsersDeactivateHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\DeleteHandler as AdminUsersDeleteHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\IndexHandler as AdminUsersIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\BlogHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\HomeHandler;
use WouterDeSchuyter\Application\Http\Middlewares\Admin\AuthenticatedUserMiddleware as AdminAuthenticatedUserMiddleware;

$app->group(null, function () use ($app) {
    $app->get('/', HomeHandler::class)->setName('home');
    $app->get('/about', AboutHandler::class)->setName('about');
    $app->get('/blog', BlogHandler::class)->setName('blog');
    $app->get('/contact', ContactHandler::class)->setName('contact');
    $app->post('/contact.json', ContactPostHandler::class)->setName('contact_post');

    // Public admin routes
    $app->group('/admin', function () use ($app) {
        $app->get('/sign-in', AdminUsersSignInHandler::class)->setName('admin.sign-in');
        $app->post('/sign-in.json', AdminUsersSignInPostHandler::class)->setName('admin.sign-in_post');
        $app->get('/sign-up', AdminSignUpHandler::class)->setName('admin.sign-up');
        $app->post('/sign-up.json', AdminSignUpPostHandler::class)->setName('admin.sign-up_post');
    });

    // Private admin routes
    $app->group('/admin', function () use ($app) {
        $app->get('', AdminOverviewHandler::class)->setName('admin.overview');
        $app->get('/media', AdminMediaHandler::class)->setName('admin.media');
        $app->group('/users', function () use ($app) {
            $app->get('', AdminUsersIndexHandler::class)->setName('admin.users');
            $app->get('/{id}/activate', AdminUsersActivateHandler::class)->setName('admin.users.activate');
            $app->get('/{id}/deactivate', AdminUsersDeactivateHandler::class)->setName('admin.users.deactivate');
            $app->get('/{id}/delete', AdminUsersDeleteHandler::class)->setName('admin.users.delete');
        });
        $app->get('/sign-out', AdminUsersSignOutHandler::class)->setName('admin.sign-out');
    })->add(AdminAuthenticatedUserMiddleware::class);
});
