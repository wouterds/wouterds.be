<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Media;

use Exception;
use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Application\Http\Validators\Admin\Media\AddRequestValidator;
use WouterDeSchuyter\Domain\Commands\Media\AddMedia;

class AddPostHandler
{
    /**
     * @var CommandBus
     */
    private $commandBus;
    /**
     * @var AddRequestValidator
     */
    private $addRequestValidator;

    /**
     * @param AddRequestValidator $addRequestValidator
     * @param CommandBus $commandBus
     */
    public function __construct(AddRequestValidator $addRequestValidator, CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
        $this->addRequestValidator = $addRequestValidator;
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

        if (!empty($request->getUploadedFiles()['file'])) {
            foreach ($request->getUploadedFiles()['file'] as $file) {
                try {
                    $this->commandBus->handle(new AddMedia($request->getParam('label'), null, $file));
                } catch (Exception $e) {
                    return $response->withJson(false, StatusCode::BAD_REQUEST);
                }
            }
        } else {
            try {
                $this->commandBus->handle(new AddMedia($request->getParam('label'), $request->getParam('url')));
            } catch (Exception $e) {
                return $response->withJson(false, StatusCode::BAD_REQUEST);
            }
        }

        return $response->withJson(true);
    }
}
