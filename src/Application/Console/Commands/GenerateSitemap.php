<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use Slim\Router;

class GenerateSitemap
{
    /**
     * @var Router
     */
    private $router;

    /**
     * @param Router $router
     */
    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    public function __invoke()
    {
    }
}
