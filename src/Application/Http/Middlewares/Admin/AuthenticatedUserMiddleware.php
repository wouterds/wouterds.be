<?php

namespace WouterDeSchuyter\Application\Http\Middlewares\Admin;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;

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
     * @param Router $router
     * @param AuthenticatedUser $authenticatedUser
     */
    public function __construct(Router $router, AuthenticatedUser $authenticatedUser)
    {
        $this->router = $router;
        $this->authenticatedUser = $authenticatedUser;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @return Response
     */
    public function __invoke(Request $request, Response $response, $next): Response
    {
        if ($this->authenticatedUser->isLoggedIn() === false) {
            $response = $response->withStatus(StatusCode::TEMPORARY_REDIRECT);
            $response = $response->withHeader('Location', $this->router->pathFor('admin.sign-in'));
            return $response;
        }

        return $next($request, $response);
    }
}
