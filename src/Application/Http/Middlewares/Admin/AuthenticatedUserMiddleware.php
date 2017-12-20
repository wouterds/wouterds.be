<?php

namespace WouterDeSchuyter\Application\Http\Middlewares\Admin;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
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
        if (!empty($request->getCookieParam('user_session_id'))) {
            $userSessionId = new UserSessionId($request->getCookieParam('user_session_id'));
            $userSession = $this->userSessionRepository->find($userSessionId);
        }

        $user = null;
        if (!empty($userSession)) {
            $user = $this->userRepository->find($userSession->getUserId());
        }

        // No activated yet?
        if ($user && empty($user->getActivatedAt())) {
            $user = null;
        }

        if (!empty($user)) {
            $this->authenticatedUser->setUser($user);
        }

        // Not logged in?
        if ($this->authenticatedUser->isLoggedIn() === false) {
            setcookie('user_session_id', false, -1, '/');
            return $response->withRedirect($this->router->pathFor('admin.users.sign-in'));
        }

        // Prolong session cookie
        setcookie('user_session_id', $userSession->getId(), time() + strtotime('1 month'), '/');

        return $next($request, $response);
    }
}
