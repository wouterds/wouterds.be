<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use League\Tactician\CommandBus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\SignInRequestValidator;
use WouterDeSchuyter\Domain\Commands\SignInUser;
use WouterDeSchuyter\Domain\Users\InvalidUserCredentials;
use WouterDeSchuyter\Domain\Users\UserNotActivatedYet;

class SignInPostHandler
{
    /**
     * @var SignInRequestValidator
     */
    private $signInRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param SignInRequestValidator $signInRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(SignInRequestValidator $signInRequestValidator, CommandBus $commandBus)
    {
        $this->signInRequestValidator = $signInRequestValidator;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->signInRequestValidator->validate($request)) {
            $response->getBody()->write(json_encode($this->signInRequestValidator->getErrors()));
            $response = $response->withHeader('Content-Type', 'application/json');
            $response = $response->withStatus(StatusCode::BAD_REQUEST);
            return $response;
        }

        try {
            $this->commandBus->handle(new SignInUser(
                $request->getParsedBody()['email'],
                $request->getParsedBody()['password']
            ));
        } catch (InvalidUserCredentials $e) {
            $response->getBody()->write(json_encode(false));
            $response = $response->withStatus(StatusCode::UNAUTHORIZED);
            $response = $response->withHeader('Content-Type', 'application/json');
            return $response;
        } catch (UserNotActivatedYet $e) {
            $response->getBody()->write(json_encode(false));
            $response = $response->withStatus(StatusCode::UNAUTHORIZED);
            $response = $response->withHeader('Content-Type', 'application/json');
            return $response;
        }

        $response->getBody()->write(json_encode(true));
        $response = $response->withHeader('Content-Type', 'application/json');
        return $response;
    }
}
