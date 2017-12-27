<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Slim\Http\Response;
use Twig_Environment;
use Twig_Error_Loader;
use Twig_Error_Runtime;
use Twig_Error_Syntax;

class Twig extends Twig_Environment
{
    /**
     * @param Response $response
     * @param string $name
     * @param array $context
     * @return Response
     * @throws Twig_Error_Loader
     * @throws Twig_Error_Runtime
     * @throws Twig_Error_Syntax
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
