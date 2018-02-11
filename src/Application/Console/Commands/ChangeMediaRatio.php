<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use League\Tactician\CommandBus;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Commands\Media\ChangeMediaRatio as ChangeMediaRatioCommand;
use WouterDeSchuyter\Domain\Media\MediaId;

class ChangeMediaRatio extends Command
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
        $this->addArgument('id', InputArgument::REQUIRED, 'The media uuid of the object.');
        $this->addArgument('ratio', InputArgument::REQUIRED, 'The ratio you to change to.');
        $this->addArgument('width', InputArgument::REQUIRED, 'The width which will be used as base.');
    }
    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->commandBus->handle(new ChangeMediaRatioCommand(
            new MediaId($input->getArgument('id')),
            $input->getArgument('ratio'),
            $input->getArgument('width')
        ));
    }
}
