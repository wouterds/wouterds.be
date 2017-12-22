<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Blog\AddRequestValidator;

class AddPostHandler
{
    /**
     * @var AddRequestValidator
     */
    private $addRequestValidator;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param AddRequestValidator $addRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(AddRequestValidator $addRequestValidator, CommandBus $commandBus)
    {
        $this->addRequestValidator = $addRequestValidator;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        if (!$this->addRequestValidator->validate($request)) {
            return $response->withJson($this->addRequestValidator->getErrors(), StatusCode::BAD_REQUEST);
        }

        return $response->withJson(true);
    }
}
