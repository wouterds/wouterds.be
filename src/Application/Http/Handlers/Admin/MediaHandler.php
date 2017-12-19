<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;

class MediaHandler extends ViewHandler
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * MediaHandler constructor.
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param RequestInterface $request
     * @param ApplicationMonitor $applicationMonitor
     * @param AuthenticatedUser $authenticatedUser
     * @param MediaRepository $mediaRepository
     */
    public function __construct(
        Twig $twig,
        Config $config,
        Router $router,
        RequestInterface $request,
        ApplicationMonitor $applicationMonitor,
        AuthenticatedUser $authenticatedUser,
        MediaRepository $mediaRepository
    ) {
        parent::__construct($twig, $config, $router, $request, $applicationMonitor, $authenticatedUser);
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/media.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $media = $this->mediaRepository->findAll();

        $data = [];
        $data['media'] = $media;
        return $this->render($response, $data);
    }
}
