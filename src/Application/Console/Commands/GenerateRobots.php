<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use League\Tactician\CommandBus;
use samdark\sitemap\Sitemap;
use Slim\Router;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Robots\GenerateRobots as GenerateRobotsCommand;
use WouterDeSchuyter\Infrastructure\Config\Config;

class GenerateRobots extends Command
{
    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @param CommandBus $commandBus
     */
    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;

        parent::__construct(get_class($this));
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->commandBus->handle(new GenerateRobotsCommand());
    }
}
