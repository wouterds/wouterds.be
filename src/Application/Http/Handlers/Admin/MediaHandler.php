<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
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
     * @var UserRepository
     */
    private $userRepository;

    /**
     * MediaHandler constructor.
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param RequestInterface $request
     * @param ApplicationMonitor $applicationMonitor
     * @param AuthenticatedUser $authenticatedUser
     * @param MediaRepository $mediaRepository
     * @param UserRepository $userRepository
     */
    public function __construct(
        Twig $twig,
        Config $config,
        Router $router,
        RequestInterface $request,
        ApplicationMonitor $applicationMonitor,
        AuthenticatedUser $authenticatedUser,
        MediaRepository $mediaRepository,
        UserRepository $userRepository
    ) {
        parent::__construct($twig, $config, $router, $request, $applicationMonitor, $authenticatedUser);
        $this->mediaRepository = $mediaRepository;
        $this->userRepository = $userRepository;
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

        $userIds = array_map(function ($media) {
            return $media->getUserId();
        }, $media);

        $users = $this->userRepository->findMultiple($userIds);

        $data = [];
        $data['media'] = $media;
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
