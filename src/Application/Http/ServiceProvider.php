<?php

namespace WouterDeSchuyter\Application\Http;

use Jenssegers\Lean\SlimServiceProvider;
use WouterDeSchuyter\Application\Exceptions\Handlers\ExceptionHandler;
use WouterDeSchuyter\Application\Http\Handlers\NotAllowedHandler;
use WouterDeSchuyter\Application\Http\Handlers\NotFoundHandler;

class ServiceProvider extends SlimServiceProvider
{
    /**
     * @inheritdoc
     */
    public function register()
    {
        parent::register();

        $this->container->share('errorHandler', function () {
            return $this->container->get(ExceptionHandler::class);
        });

        $this->container->share('phpErrorHandler', function () {
            return $this->container->get(ExceptionHandler::class);
        });

        $this->container->share('notFoundHandler', function () {
            return $this->container->get(NotFoundHandler::class);
        });

        $this->container->share('notAllowedHandler', function () {
            return $this->container->get(NotAllowedHandler::class);
        });
    }
}
