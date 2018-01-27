<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use League\Tactician\CommandBus;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Commands\Sitemap\GenerateSitemap as GenerateSitemapCommand;

class GenerateSitemap extends Command
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

    protected function configure()
    {
        $this->addOption('ping');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->commandBus->handle(new GenerateSitemapCommand($input->getOption('ping')));
    }
}
