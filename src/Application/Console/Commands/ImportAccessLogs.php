<?php

namespace WouterDeSchuyter\Application\Console\Commands;

use League\Tactician\CommandBus;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WouterDeSchuyter\Domain\Commands\AccessLogs\ImportAccessLogs as ImportAccessLogsCommand;

class ImportAccessLogs extends Command
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
        $this->commandBus->handle(new ImportAccessLogsCommand(APP_DIR . '/storage/logs/nginx/access.log'));
    }
}
