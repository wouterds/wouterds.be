<?php

namespace WouterDeSchuyter\Application\Http\Handlers\Admin;

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Router;
use WouterDeSchuyter\Application\Http\Handlers\ViewHandler as BaseViewHandler;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\View\Twig;
use WouterDeSchuyter\Infrastructure\View\View;

abstract class ViewHandler extends BaseViewHandler implements View
{
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

        return parent::render($response, $data);
    }
}
