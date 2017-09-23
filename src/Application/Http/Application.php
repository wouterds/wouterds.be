<?php

namespace Wouterds\Application\Http;

use Slim\App;
use Wouterds\Application\Container;

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
        require __DIR__ . '/routes.php';
    }
}
