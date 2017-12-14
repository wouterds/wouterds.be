<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Respect\Validation\Exceptions\AllOfException;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Exceptions\ValidationException;
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
        try {
            $this->contactRequestValidator->validate($request);
        } catch (NestedValidationException $e) {
            $errors = array_filter(array_values($e->findMessages([
                'notEmpty' => '{{name}} - Please enter a value.',
                'email' => '{{name}} - Please enter a valid email.',
            ])));
            die(json_encode($errors));
        }

        $data = [];

        $response->getBody()->write(json_encode($data));

        return $response;
    }
}
