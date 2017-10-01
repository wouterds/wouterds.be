<?php

namespace Wouterds\Application\Http\Middlewares;

use Slim\Http\Request;
use Slim\Http\Response;
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
     * @param Twig $twig
     * @param Config $config
     */
    public function __construct(Twig $twig, Config $config)
    {
        $this->twig = $twig;
        $this->config = $config;
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
         ]);

        return $next($request, $response);
    }
}
