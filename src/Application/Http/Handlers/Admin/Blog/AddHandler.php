<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Blog;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Application\Http\Handlers\Admin\ViewHandler;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;

class AddHandler extends ViewHandler
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;

    public function __construct(
        Twig $twig,
        Config $config,
        Router $router,
        Request $request,
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
        return 'pages/admin/blog/add.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $media = $this->mediaRepository->findAll();
        $users = $this->userRepository->findAll();

        $data = [];
        $data['media'] = $media;
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
