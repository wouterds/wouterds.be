<?php

namespace Wouterds\Application\Http\Middlewares;

use Slim\Http\Request;
use Slim\Http\Response;
use Wouterds\Infrastructure\View\Twig;

class TwigMiddleware
{
    /**
     * @var Twig
     */
    private $twig;

    /**
     * @param Twig $twig
     */
    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
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
         ]);

        return $next($request, $response);
    }
}
