<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Application\Http\Handlers\Admin\ViewHandler;

class SignInHandler extends ViewHandler
{
    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/users/sign-in.html.twig';
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
