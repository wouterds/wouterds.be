<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Domain\Commands\Users\SignOutUser;
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
        $userSessionId = new UserSessionId($request->getCookieParam('user_session_id'));

        $this->commandBus->handle(new SignOutUser($userSessionId));

        return $response->withRedirect($this->router->pathFor('admin'));
    }
}
