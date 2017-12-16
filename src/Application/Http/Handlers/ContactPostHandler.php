<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use League\Tactician\CommandBus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
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
            $response->getBody()->write(json_encode($this->contactRequestValidator->getErrors()));
            $response = $response->withHeader('Content-Type', 'application/json');
            $response = $response->withStatus(StatusCode::BAD_REQUEST);
            return $response;
        }

        $this->commandBus->handle(new ContactEnquiry(
            $request->getParsedBody()['name'],
            $request->getParsedBody()['email'],
            $request->getParsedBody()['subject'],
            $request->getParsedBody()['message']
        ));

        $response->getBody()->write(json_encode(true));
        $response = $response->withHeader('Content-Type', 'application/json');
        return $response;
    }
}
