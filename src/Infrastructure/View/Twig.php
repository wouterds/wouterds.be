<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Slim\Http\Response;
use Twig_Environment;

class Twig extends Twig_Environment
{
    /**
     * @param Response $response
     * @param string $name
     * @param array $context
     * @return Response
     */
    public function renderWithResponse(Response $response, string $name, array $context = []): Response
    {
        // Render template
        $contents = $this->render($name, $context);

        // Write contents to response
        $response->getBody()->write($contents);

        return $response;
    }
}
