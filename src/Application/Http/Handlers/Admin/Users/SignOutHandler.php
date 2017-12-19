<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use League\Tactician\CommandBus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Commands\SignOutUser;
use WouterDeSchuyter\Domain\Users\UserSessionId;

class SignOutHandler
{
    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @var Router
     */
    private $router;

    /**
     * @param Router $router
     * @param CommandBus $commandBus
     */
    public function __construct(Router $router, CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
        $this->router = $router;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $userSessionId = new UserSessionId($request->getCookieParams()['user_session_id']);

        $this->commandBus->handle(new SignOutUser($userSessionId));

        $response = $response->withHeader('Location', $this->router->pathFor('admin.overview'));
        $response = $response->withStatus(StatusCode::TEMPORARY_REDIRECT);
        return $response;
    }
}
