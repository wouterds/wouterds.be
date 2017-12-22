<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Users\SignUpRequestValidator;
use WouterDeSchuyter\Domain\Commands\Users\SignUpUser;

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
            return $response->withJson($this->signUpRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        $this->commandBus->handle(new SignUpUser(
            $request->getParam('name'),
            $request->getParam('email'),
            $request->getParam('password')
        ));

        return $response->withJson(true);
    }
}
