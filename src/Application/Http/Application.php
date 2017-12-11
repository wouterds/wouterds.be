<?php

namespace WouterDeSchuyter\Application\Http;

use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use WouterDeSchuyter\Application\Container;

class Application extends App
{
    public function __construct()
    {
        parent::__construct(Container::load());

        $this->loadRoutes();
    }

    private function loadRoutes()
    {
        $app = $this;
        $request = $app->getContainer()->get(Request::class);

        // Dirty, to be fixed
        $routes = __DIR__ . '/routes-web.php';
        if (stripos($request->getUri()->getHost(), 'api') !== false) {
            $routes = __DIR__ . '/routes-api.php';
        }

        require_once $routes;
    }
}
