<?php

namespace WouterDeSchuyter\Application\Console;

use Symfony\Component\Console\Application as SymfonyApplication;
use Symfony\Component\Console\Command\Command;
use WouterDeSchuyter\Application\Console\Commands\GenerateSitemap;
use WouterDeSchuyter\Application\Container;

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

        $this->container = Container::load();

        $this->addCommand('generate:sitemap', GenerateSitemap::class);
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
