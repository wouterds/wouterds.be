<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use WouterDeSchuyter\Infrastructure\View\AbstractViewHandler;

class HomeHandler extends AbstractViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/home.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        return $this->render($response);
    }
}
