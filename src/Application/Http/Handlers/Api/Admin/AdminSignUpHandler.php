<?php

namespace Wouterds\Application\Http\Handlers\Api\Admin;

use Slim\Http\Request;
use Slim\Http\Response;

class AdminSignUpHandler
{
    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $data = [
            'status' => 'success',
        ];
        return $response->withJson($data);
    }
}
