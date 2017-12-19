<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use Teapot\StatusCode;

class ActivateHandler
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

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $response = $response->withHeader('Location', $this->router->pathFor('admin.users'));
        $response = $response->withStatus(StatusCode::TEMPORARY_REDIRECT);
        return $response;
    }
}
