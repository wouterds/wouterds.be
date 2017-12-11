<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Psr\Http\Message\ResponseInterface as Response;
use Twig_Environment;

class Twig extends Twig_Environment
{
    /**
     * @param Response $response
     * @param $name
     * @param array $context
     * @return Response
     */
    public function renderWithResponse(Response $response, $name, array $context = []): Response
    {
        // Render template
        $contents = $this->render($name, $context);

        // Write contents to response
        $response->getBody()->write($contents);

        return $response;
    }
}
