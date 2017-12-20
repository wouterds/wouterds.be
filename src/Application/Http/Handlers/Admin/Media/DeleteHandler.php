<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Media;

use League\Tactician\CommandBus;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Domain\Commands\Media\DeleteMedia;
use WouterDeSchuyter\Domain\Media\MediaId;

class DeleteHandler
{
    /**
     * @var Router
     */
    private $router;

    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param Router $router
     * @param CommandBus $commandBus
     */
    public function __construct(Router $router, CommandBus $commandBus)
    {
        $this->router = $router;
        $this->commandBus = $commandBus;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param string $id
     * @return Response
     */
    public function __invoke(Request $request, Response $response, string $id): Response
    {
        $this->commandBus->handle(new DeleteMedia(new MediaId($id)));

        return $response->withRedirect($this->router->pathFor('admin.media'));
    }
}
