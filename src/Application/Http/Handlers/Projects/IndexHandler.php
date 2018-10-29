<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Projects;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\Projects\ProjectsPostRepository;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class IndexHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @return null|string
     */
    public function getAmpStylesheet(): ?string
    {
        return 'projects.index.css';
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/projects/index.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param int $page
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $data = [];

        return $this->render($response, $data);
    }
}
