<?php

namespace Wouterds\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;
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
        // Add extra page-info
        $data['pageInfo'] = $this->pageInfo();

        // Render template to response
        return $this->renderer->renderWithResponse($response, $this->getTemplate(), $data);
    }

    /**
     * Home request handler
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        return $this->render($response);
    }

    /**
     * @return array
     */
    private function pageInfo(): array
    {
        $templateName = $this->getTemplate();
        $templateName = str_replace('.html.twig', null, $templateName);
        $templateParts = preg_split( "/(-|\/)/", $templateName );
        $templateParts = array_filter($templateParts);

        $pascalCaseName = array_map('ucfirst', $templateParts);
        $pascalCaseName = implode('', $pascalCaseName);

        $dashedCaseName = implode('-', $templateParts);
        $dashedCaseName = lcfirst($dashedCaseName);

        return [
            'pascalCase' => $pascalCaseName,
            'dashedCase' => $dashedCaseName,
        ];
    }
}
