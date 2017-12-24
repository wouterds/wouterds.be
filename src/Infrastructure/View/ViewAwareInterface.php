<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Slim\Http\Request;
use Slim\Http\Response;

interface ViewAwareInterface
{
    /**
     * @return string
     */
    public function getTemplate(): string;

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response;
}
