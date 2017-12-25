<?php

namespace WouterDeSchuyter\Application\Http;

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

        require_once __DIR__ . '/routes.php';
    }
}
