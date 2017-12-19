<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use WouterDeSchuyter\Application\Http\Handlers\ViewHandler;

class SignUpHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/sign-up.html.twig';
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
