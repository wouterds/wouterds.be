<?php

namespace Wouterds\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;

class HomeHandler
{
    /**
     * Home request handler
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $response->getBody()->write('Hello World!');

        return $response;
    }
}
