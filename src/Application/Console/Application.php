<?php

namespace WouterDeSchuyter\Application\Console;

use Symfony\Component\Console\Application as SymfonyApplication;
use Symfony\Component\Console\Command\Command;
use WouterDeSchuyter\Application\Console\Commands\ChangeMediaRatio;
use WouterDeSchuyter\Application\Console\Commands\GenerateRobots;
use WouterDeSchuyter\Application\Console\Commands\GenerateRss;
use WouterDeSchuyter\Application\Console\Commands\GenerateSitemap;
use WouterDeSchuyter\Application\Console\Commands\GenerateStructuredDataForBlogPosts;
use WouterDeSchuyter\Application\Console\Commands\ImportAccessLogs;
use WouterDeSchuyter\Application\Container;
use WouterDeSchuyter\Application\Http\Application as HttpApplication;

class Application extends SymfonyApplication
{
    /**
     * @var Container
     */
    private $container;

    /**
     * @param string $name
     * @param string $version
     */
    public function __construct($name = 'UNKNOWN', $version = 'UNKNOWN')
    {
        parent::__construct($name, $version);

        // Load Http application so we have Router context etc
        $httpApplication = new HttpApplication();
        $this->container = $httpApplication->getContainer();

        $this->addCommand('generate:sitemap', GenerateSitemap::class);
        $this->addCommand('generate:robots', GenerateRobots::class);
        $this->addCommand('generate:rss', GenerateRss::class);
        $this->addCommand('import:access-logs', ImportAccessLogs::class);
        $this->addCommand('media:change-ratio', ChangeMediaRatio::class);
        $this->addCommand('blog:generate-structured-data', GenerateStructuredDataForBlogPosts::class);
    }

    /**
     * @param string $name
     * @param string $class
     */
    public function addCommand(string $name, string $class)
    {
        /** @var Command $command */
        $command = $this->container->get($class);
        $command->setName($name);

        $this->add($command);
    }
}
