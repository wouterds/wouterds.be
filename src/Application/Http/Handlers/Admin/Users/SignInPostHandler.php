<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Users\SignInRequestValidator;
use WouterDeSchuyter\Domain\Commands\Users\SignInUser;
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
            return $response->withJson($this->signInRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        try {
            $this->commandBus->handle(new SignInUser(
                $request->getParam('email'),
                $request->getParam('password')
            ));
        } catch (InvalidUserCredentials $e) {
            return $response->withJson(false, StatusCode::UNAUTHORIZED);
        } catch (UserNotActivatedYet $e) {
            return $response->withJson(false, StatusCode::UNAUTHORIZED);
        }

        return $response->withJson(true);
    }
}
