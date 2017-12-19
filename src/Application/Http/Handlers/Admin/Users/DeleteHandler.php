<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use League\Tactician\CommandBus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Commands\Users\DeleteUser;
use WouterDeSchuyter\Domain\Users\UserId;

class DeleteHandler
{
    /**
     * @var Router
     */
    private $router;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param Router $router
     * @param CommandBus $commandBus
     */
    public function __construct(Router $router, CommandBus $commandBus)
    {
        $this->router = $router;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param string $id
     * @return Response
     */
    public function __invoke(Request $request, Response $response, string $id): Response
    {
        $this->commandBus->handle(new DeleteUser(new UserId($id)));

        $response = $response->withHeader('Location', $this->router->pathFor('admin.users'));
        $response = $response->withStatus(StatusCode::TEMPORARY_REDIRECT);
        return $response;
    }
}
