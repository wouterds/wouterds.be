<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin\Users;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Application\Http\Handlers\Admin\ViewHandler;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;

class IndexHandler extends ViewHandler
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param Request $request
     * @param ApplicationMonitor $applicationMonitor
     * @param AuthenticatedUser $authenticatedUser
     * @param UserRepository $userRepository
     */
    public function __construct(
        Twig $twig,
        Config $config,
        Router $router,
        Request $request,
        ApplicationMonitor $applicationMonitor,
        AuthenticatedUser $authenticatedUser,
        UserRepository $userRepository
    ) {
        parent::__construct($twig, $config, $router, $request, $applicationMonitor, $authenticatedUser);
        $this->userRepository = $userRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/admin/users/index.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $users = $this->userRepository->findAll();

        $data = [];
        $data['users'] = $users;

        return $this->render($response, $data);
    }
}
