<?php

namespace WouterDeSchuyter\Application\Http;

use Slim\App;
use WouterDeSchuyter\Application\Http\Handlers\AboutHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\AddHandler as AdminBlogAddHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\DeleteHandler as AdminBlogDeleteHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\EditHandler as AdminBlogEditHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\IndexHandler as AdminBlogIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\Admin\Blog\SavePostHandler as AdminBlogSavePostHandler;
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
use WouterDeSchuyter\Application\Http\Handlers\Blog\DetailHandler as BlogDetailHandler;
use WouterDeSchuyter\Application\Http\Handlers\Blog\IndexHandler as BlogIndexHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactHandler;
use WouterDeSchuyter\Application\Http\Handlers\ContactPostHandler;
use WouterDeSchuyter\Application\Http\Handlers\HomeHandler;
use WouterDeSchuyter\Application\Http\Handlers\StatsHandler;
use WouterDeSchuyter\Application\Http\Middlewares\Admin\AuthenticatedUserMiddleware as AdminAuthenticatedUserMiddleware;

class Routes
{
    /**
     * @var App
     */
    private $app;

    /**
     * @param App $app
     */
    public function __construct(App $app)
    {
        $this->app = $app;
    }

    public function register()
    {
        $self = $this;
        $self->registerRoutes($self->app);
        $self->registerAmpCompatibleRoutes($self->app);
        $self->app->group('/amp', function () use ($self) {
            $self->registerAmpCompatibleRoutes($self->app, true);
        });
        $self->registerAdminRoutes($self->app);
    }

    /**
     * @param App $app
     */
    private function registerRoutes(App $app)
    {
        $app->post('/contact.json', ContactPostHandler::class)->setName('contact_post');
    }

    /**
     * @param App $app
     * @param bool $amp
     */
    private function registerAmpCompatibleRoutes(App $app, bool $amp = false)
    {
        $suffix = $amp ? ':amp' : '';

        $app->get($amp ? '' : '/', HomeHandler::class)->setName('home' . $suffix);
        $app->get('/about', AboutHandler::class)->setName('about' . $suffix);
        $app->group('/blog', function () use ($app, $suffix) {
            $app->get('', BlogIndexHandler::class)->setName('blog' . $suffix);
            $app->get('/{slug}', BlogDetailHandler::class)->setName('blog.detail' . $suffix);
        });
        $app->get('/contact', ContactHandler::class)->setName('contact' . $suffix);
        $app->get('/stats', StatsHandler::class)->setName('stats' . $suffix);
    }

    /**
     * @param App $app
     */
    private function registerAdminRoutes(App $app)
    {
        // Public routes
        $app->group('/admin', function () use ($app) {
            $app->group('/users', function () use ($app) {
                $app->get('/sign-in', AdminUsersSignInHandler::class)->setName('admin.users.sign-in');
                $app->post('/sign-in.json', AdminUsersSignInPostHandler::class)->setName('admin.users.sign-in_post');
                $app->get('/sign-up', AdminUsersSignUpHandler::class)->setName('admin.users.sign-up');
                $app->post('/sign-up.json', AdminUsersSignUpPostHandler::class)->setName('admin.users.sign-up_post');
            });
        });

        // Protected routes
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
    }
}
