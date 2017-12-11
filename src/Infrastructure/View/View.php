<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Psr\Http\Message\ResponseInterface as Response;

interface View
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
