<?php

namespace Wouterds\Application\Http\Handlers;

use Slim\Http\Response;
use Wouterds\Application\Http\Handlers\View;
use Wouterds\Infrastructure\View\Twig;

abstract class ViewHandler implements View
{
    /**
     * @var Twig
     */
    protected $renderer;

    /**
     * ViewHandler constructor
     *
     * @param Twig $twig
     */
    public function __construct(Twig $twig)
    {
        $this->renderer = $twig;
    }

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response
    {
        // Render template to response
        return $this->renderer->renderWithResponse($response, $this->getTemplate(), $data);
    }
}
