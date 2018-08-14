<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Domain\Users\UserSessionId;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class SignOutHandler
{
    /**
     * @var Router
     */
    private $router;

    /**
     * @var UserSessionRepository
     */
    private $userSessionRepository;

    /**
     * @param Router $router
     * @param CommandBus $commandBus
     */
    public function __construct(Router $router, UserSessionRepository $userSessionRepository)
    {
        $this->router = $router;
        $this->userSessionRepository = $userSessionRepository;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $this->userSessionRepository->delete($request->getCookieParam('user_session_id'));

        setcookie('user_session_id', $request->getCookieParam('user_session_id'), -1, '/');

        return $response->withRedirect($this->router->pathFor('admin'));
    }
}
