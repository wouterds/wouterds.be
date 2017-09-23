<?php

namespace Wouterds\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;

class HomeHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'home.html.twig';
    }

    /**
     * Home request handler
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        return $this->render($response);
    }
}
