<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\ContactRequestValidator;

class ContactPostHandler
{
    /**
     * @var ContactRequestValidator
     */
    private $contactRequestValidator;

    /**
     * @param ContactRequestValidator $contactRequestValidator
     */
    public function __construct(ContactRequestValidator $contactRequestValidator)
    {
        $this->contactRequestValidator = $contactRequestValidator;
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

        $data = [];

        $response->getBody()->write(json_encode($data));

        return $response;
    }
}
