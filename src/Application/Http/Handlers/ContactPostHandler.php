<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\ContactRequestValidator;
use WouterDeSchuyter\Domain\Commands\ContactEnquiry;

class ContactPostHandler
{
    /**
     * @var ContactRequestValidator
     */
    private $contactRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param ContactRequestValidator $contactRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(ContactRequestValidator $contactRequestValidator, CommandBus $commandBus)
    {
        $this->contactRequestValidator = $contactRequestValidator;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->contactRequestValidator->validate($request)) {
            return $response->withJson($this->contactRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        $this->commandBus->handle(new ContactEnquiry(
            $request->getParam('name'),
            $request->getParam('email'),
            $request->getParam('subject'),
            $request->getParam('message')
        ));

        return $response->withJson(true);
    }
}
