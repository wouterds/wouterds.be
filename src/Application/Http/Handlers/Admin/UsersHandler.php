<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Router;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Domain\Users\UserRepository;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;

class UsersHandler extends ViewHandler
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param RequestInterface $request
     * @param ApplicationMonitor $applicationMonitor
     * @param AuthenticatedUser $authenticatedUser
     * @param UserRepository $userRepository
     */
    public function __construct(Twig $twig,
                                Config $config,
                                Router $router,
                                RequestInterface $request,
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
        return 'pages/admin/users.html.twig';
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
