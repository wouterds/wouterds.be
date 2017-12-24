<?php

use WouterDeSchuyter\Application\Http\Handlers\AboutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\AddHandler as AdminBlogAddHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\EditHandler as AdminBlogEditHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\SavePostHandler as AdminBlogSavePostHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\IndexHandler as AdminBlogIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\DeleteHandler as AdminBlogDeleteHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\IndexHandler as AdminIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Media\AddHandler as AdminMediaAddHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Media\AddPostHandler as AdminMediaAddPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Media\DeleteHandler as AdminMediaDeleteHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Media\IndexHandler as AdminMediaIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\ActivateHandler as AdminUsersActivateHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\DeactivateHandler as AdminUsersDeactivateHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\DeleteHandler as AdminUsersDeleteHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\IndexHandler as AdminUsersIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignInHandler as AdminUsersSignInHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignInPostHandler as AdminUsersSignInPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignOutHandler as AdminUsersSignOutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignUpHandler as AdminUsersSignUpHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Users\SignUpPostHandler as AdminUsersSignUpPostHandler;
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
        $app->group('/users', function () use ($app) {
            $app->get('/sign-in', AdminUsersSignInHandler::class)->setName('admin.users.sign-in');
            $app->post('/sign-in.json', AdminUsersSignInPostHandler::class)->setName('admin.users.sign-in_post');
            $app->get('/sign-up', AdminUsersSignUpHandler::class)->setName('admin.users.sign-up');
            $app->post('/sign-up.json', AdminUsersSignUpPostHandler::class)->setName('admin.users.sign-up_post');
        });
    });

    // Private admin routes
    $app->group('/admin', function () use ($app) {
        $app->get('', AdminIndexHandler::class)->setName('admin');

        $app->group('/blog', function () use ($app) {
            $app->get('', AdminBlogIndexHandler::class)->setName('admin.blog');
            $app->get('/add', AdminBlogAddHandler::class)->setName('admin.blog.add');
            $app->get('/{id}/edit', AdminBlogEditHandler::class)->setName('admin.blog.edit');
            $app->post('/save.json', AdminBlogSavePostHandler::class)->setName('admin.blog.save_post');
            $app->get('/{id}/delete', AdminBlogDeleteHandler::class)->setName('admin.blog.delete');
        });

        $app->group('/media', function () use ($app) {
            $app->get('', AdminMediaIndexHandler::class)->setName('admin.media');
            $app->get('/add', AdminMediaAddHandler::class)->setName('admin.media.add');
            $app->post('/add.json', AdminMediaAddPostHandler::class)->setName('admin.media.add_post');
            $app->get('/{id}/delete', AdminMediaDeleteHandler::class)->setName('admin.media.delete');
        });

        $app->group('/users', function () use ($app) {
            $app->get('', AdminUsersIndexHandler::class)->setName('admin.users');
            $app->get('/{id}/activate', AdminUsersActivateHandler::class)->setName('admin.users.activate');
            $app->get('/{id}/deactivate', AdminUsersDeactivateHandler::class)->setName('admin.users.deactivate');
            $app->get('/{id}/delete', AdminUsersDeleteHandler::class)->setName('admin.users.delete');
        });
        $app->get('/sign-out', AdminUsersSignOutHandler::class)->setName('admin.sign-out');
    })->add(AdminAuthenticatedUserMiddleware::class);
});
