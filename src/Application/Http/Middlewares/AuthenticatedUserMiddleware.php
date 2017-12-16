<?php

namespace WouterDeSchuyter\Application\Http\Middlewares;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;

class AuthenticatedUserMiddleware
{
    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @param AuthenticatedUser $authenticatedUser
     */
    public function __construct(AuthenticatedUser $authenticatedUser)
    {
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
        return $next($request, $response);
    }
}
