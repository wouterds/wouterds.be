<?php

namespace WouterDeSchuyter\Application\Http;

use Slim\App;
use WouterDeSchuyter\Application\Container;

class Application extends App
{
    public function __construct()
    {
        // Load container
        $container = Container::load();

        // Load parent constructor
        parent::__construct($container);

        // Register routes
        (new Routes($this))->register();
    }
}
