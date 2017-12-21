<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Media;

use Exception;
use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Domain\Commands\Media\AddMedia;

class AddPostHandler
{
    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param CommandBus $commandBus
     */
    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        try {
            $this->commandBus->handle(new AddMedia(
                $request->getParam('label'),
                $request->getUploadedFiles()['file']
            ));
        } catch (Exception $e) {
            return $response->withJson(false, StatusCode::BAD_REQUEST);
        }

        return $response->withJson(true);
    }
}
