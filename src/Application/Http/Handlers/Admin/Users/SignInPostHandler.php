<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use Dflydev\FigCookies\SetCookie;
use Dflydev\FigCookies\FigResponseCookies;
use WouterDeSchuyter\Application\Http\Validators\Admin\Users\SignInRequestValidator;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Domain\Users\UserSession;
use WouterDeSchuyter\Domain\Users\UserSessionRepository;

class SignInPostHandler
{
    /**
     * @var SignInRequestValidator
     */
    private $signInRequestValidator;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var UserSessionRepository
     */
    private $userSessionRepository;

    /**
     * @param SignInRequestValidator $signInRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(SignInRequestValidator $signInRequestValidator, UserRepository $userRepository, UserSessionRepository $userSessionRepository)
    {
        $this->signInRequestValidator = $signInRequestValidator;
        $this->userRepository = $userRepository;
        $this->userSessionRepository = $userSessionRepository;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->signInRequestValidator->validate($request)) {
            return $response->withJson($this->signInRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        $user = $this->userRepository->findByEmail($request->getParam('email'));

        // No user found?
        if (empty($user)) {
            return $response->withJson(false, StatusCode::UNAUTHORIZED);
        }

        // Invalid password?
        if (User::hashPassword($user->getSalt(), $request->getParam('password')) !== $user->getPassword()) {
            return $response->withJson(false, StatusCode::UNAUTHORIZED);
        }

        // Not activated?
        if (empty($user->getActivatedAt())) {
            return $response->withJson(false, StatusCode::UNAUTHORIZED);
        }

        // Delete old sessions, allow only 1 client to be signed in at the time
        $this->userSessionRepository->deleteByUserId($user->getId());

        // New user session
        $userSession = new UserSession($user->getId());
        $this->userSessionRepository->add($userSession);

        $cookie = SetCookie::create('user_session_id', $userSession->getId())->withPath('/');
        $response = FigResponseCookies::set($response, $cookie);

        return $response->withJson(true);
    }
}
