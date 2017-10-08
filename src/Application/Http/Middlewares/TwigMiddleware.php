<?php

namespace Wouterds\Application\Http\Middlewares;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use Wouterds\Infrastructure\Config\Config;
use Wouterds\Infrastructure\View\Twig;

class TwigMiddleware
{
    /**
     * @var Twig
     */
    private $twig;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var Router
     */
    private $router;

    /**
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     */
    public function __construct(Twig $twig, Config $config, Router $router)
    {
        $this->twig = $twig;
        $this->config = $config;
        $this->router = $router;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param Callable $next
     * @return Response
     */
    public function __invoke(Request $request, Response $response, $next): Response
    {
         $this->twig->addGlobal('app', [
             'request' => $request,
             'config' => $this->config,
             'router' => $this->router,
         ]);

        return $next($request, $response);
    }
}
