<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;
use WouterDeSchuyter\Infrastructure\Database\SQLLogger;

trait ViewAwareTrait
{
    /**
     * @var Twig
     */
    private $twig;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var Router
     */
    private $router;

    /**
     * @var Request
     */
    private $request;

    /**
     * @var ApplicationMonitor
     */
    private $applicationMonitor;

    /**
     * @var SQLLogger
     */
    private $sqlLogger;

    /**
     * @return string
     */
    public abstract function getTemplate(): string;

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        return $this->render($response);
    }

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response
    {
        $this->applicationMonitor->setQueryCount($this->sqlLogger->getQueryCount());

        if (empty($data['app'])) {
            $data['app'] = [];
        }

        if (empty($data['page'])) {
            $data['page'] = [];
        }

        $data['page']['info'] = $this->pageInfo();
        $data['app']['config'] = $this->config;
        $data['app']['router'] = $this->router;
        $data['app']['request'] = $this->request;
        $data['app']['report'] = $this->applicationMonitor->getReport();

        return $this->twig->renderWithResponse($response, $this->getTemplate(), $data);
    }

    /**
     * @param Twig $twig
     */
    public function setTwig(Twig $twig): void
    {
        $this->twig = $twig;
    }

    /**
     * @param Config $config
     */
    public function setConfig(Config $config): void
    {
        $this->config = $config;
    }

    /**
     * @param Router $router
     */
    public function setRouter(Router $router): void
    {
        $this->router = $router;
    }

    /**
     * @param Request $request
     */
    public function setRequest(Request $request): void
    {
        $this->request = $request;
    }

    /**
     * @param ApplicationMonitor $applicationMonitor
     */
    public function setApplicationMonitor(ApplicationMonitor $applicationMonitor): void
    {
        $this->applicationMonitor = $applicationMonitor;
    }

    /**
     * @param SQLLogger $sqlLogger
     */
    public function setSqlLogger(SQLLogger $sqlLogger)
    {
        $this->sqlLogger = $sqlLogger;
    }

    /**
     * @return array
     */
    private function pageInfo(): array
    {
        $templateName = $this->getTemplate();
        $templateName = str_replace('pages/', null, $templateName);
        $templateName = str_replace('.html.twig', null, $templateName);
        $templateParts = explode('/', $templateName);
        $templatePartsWords = preg_split('/(-|\/)/', $templateName);
        $templateParts = array_filter($templateParts);

        $pascalCaseName = array_map('ucfirst', $templatePartsWords);
        $pascalCaseName = implode('', $pascalCaseName);

        $dashedCaseName = implode('-', $templateParts);
        $dashedCaseName = lcfirst($dashedCaseName);

        $className = 'page';
        $page = '';
        foreach ($templateParts as $part) {
            if (!empty($page)) {
                $page .= '--';
            }

            $page .= $part;

            $className .= ' page--' . $page;
        }

        return [
            'pascalCase' => $pascalCaseName,
            'dashedCase' => $dashedCaseName,
            'className' => $className,
        ];
    }
}
