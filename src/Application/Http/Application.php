<?php

namespace Wouterds\Application\Http;

use Slim\App;

class Application extends App
{
    public function __construct()
    {
        parent::__construct();

        $this->loadRoutes();
    }

    private function loadRoutes()
    {
        $app = $this;
        require __DIR__ . '/routes.php';
    }
}
