<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Router;
use WouterDeSchuyter\Application\Http\Handlers\ViewHandler as BaseViewHandler;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;
use WouterDeSchuyter\Infrastructure\View\View;

abstract class ViewHandler extends BaseViewHandler implements View
{
    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param Request $request
     * @param ApplicationMonitor $applicationMonitor
     * @param AuthenticatedUser $authenticatedUser
     */
    public function __construct(Twig $twig,
                                Config $config,
                                Router $router,
                                Request $request,
                                ApplicationMonitor $applicationMonitor,
                                AuthenticatedUser $authenticatedUser
    ) {
        parent::__construct($twig, $config, $router, $request, $applicationMonitor);
        $this->authenticatedUser = $authenticatedUser;
    }

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response
    {
        if (empty($data['footer'])) {
            $data['footer'] = [];
        }

        $data['footer']['admin'] = true;

        if (empty($data['header'])) {
            $data['header'] = [];
        }

        $data['header']['admin'] = true;

        if ($this->authenticatedUser->isLoggedIn()) {
            $data['user'] = [
                'id' => $this->authenticatedUser->getUser()->getId(),
                'name' => $this->authenticatedUser->getUser()->getName(),
                'email' => $this->authenticatedUser->getUser()->getEmail(),
            ];
        }

        return parent::render($response, $data);
    }
}
