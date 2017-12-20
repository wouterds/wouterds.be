<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;

class ContactHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/contact.html.twig';
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
