<?php

namespace WouterDeSchuyter\Application\Http\Middlewares\Admin;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSessionId;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class AuthenticatedUserMiddleware
{
    /**
     * @var Router
     */
    private $router;

    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @var UserSessionRepository
     */
    private $userSessionRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param Router $router
     * @param AuthenticatedUser $authenticatedUser
     * @param UserSessionRepository $userSessionRepository
     * @param UserRepository $userRepository
     */
    public function __construct(
        Router $router,
        AuthenticatedUser $authenticatedUser,
        UserSessionRepository $userSessionRepository,
        UserRepository $userRepository
    ) {
        $this->router = $router;
        $this->authenticatedUser = $authenticatedUser;
        $this->userSessionRepository = $userSessionRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @return Response
     */
    public function __invoke(Request $request, Response $response, $next): Response
    {
        $userSession = null;
        if (!empty($request->getCookieParams()['user_session_id'])) {
            $userSessionId = new UserSessionId($request->getCookieParams()['user_session_id']);
            $userSession = $this->userSessionRepository->find($userSessionId);
        }

        $user = null;
        if (!empty($userSession)) {
            $user = $this->userRepository->find($userSession->getUserId());
        }

        if (!empty($user)) {
            $this->authenticatedUser->setUser($user);
        }

        // Not logged in?
        if ($this->authenticatedUser->isLoggedIn() === false) {
            setcookie('user_session_id', false, -1);
            $response = $response->withStatus(StatusCode::TEMPORARY_REDIRECT);
            $response = $response->withHeader('Location', $this->router->pathFor('admin.sign-in'));
            return $response;
        }

        // Prolong session cookie
        setcookie('user_session_id', $userSession->getId(), time() + strtotime('1 month'));

        return $next($request, $response);
    }
}
