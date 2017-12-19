<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use League\Tactician\CommandBus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\SignUpRequestValidator;
use WouterDeSchuyter\Domain\Commands\SignUpUser;

class SignUpPostHandler
{
    /**
     * @var SignUpRequestValidator
     */
    private $signUpRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param SignUpRequestValidator $signUpRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(SignUpRequestValidator $signUpRequestValidator, CommandBus $commandBus)
    {
        $this->signUpRequestValidator = $signUpRequestValidator;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->signUpRequestValidator->validate($request)) {
            $response->getBody()->write(json_encode($this->signUpRequestValidator->getErrors()));
            $response = $response->withHeader('Content-Type', 'application/json');
            $response = $response->withStatus(StatusCode::BAD_REQUEST);
            return $response;
        }

        $this->commandBus->handle(new SignUpUser(
            $request->getParsedBody()['name'],
            $request->getParsedBody()['email'],
            $request->getParsedBody()['password']
        ));

        $response->getBody()->write(json_encode(true));
        $response = $response->withHeader('Content-Type', 'application/json');
        return $response;
    }
}
