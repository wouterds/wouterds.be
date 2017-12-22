<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;
use Teapot\StatusCode;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class NotFoundHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return '404.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        return $this->render($response->withStatus(StatusCode::NOT_FOUND));
    }
}
