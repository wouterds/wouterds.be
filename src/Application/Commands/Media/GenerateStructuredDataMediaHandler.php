<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use League\Tactician\CommandBus;
use WouterDeSchuyter\Domain\Commands\Media\ChangeMediaRatio;
use WouterDeSchuyter\Domain\Commands\Media\GenerateStructuredDataMedia;

class GenerateStructuredDataMediaHandler
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
    }

    /**
     * @param GenerateStructuredDataMedia $generateStructuredDataMedia
     */
    public function handle(GenerateStructuredDataMedia $generateStructuredDataMedia)
    {
        $this->commandBus->handle(new ChangeMediaRatio($generateStructuredDataMedia->getMediaId(), '1:1', 1024));
        $this->commandBus->handle(new ChangeMediaRatio($generateStructuredDataMedia->getMediaId(), '16:9', 1024));
        $this->commandBus->handle(new ChangeMediaRatio($generateStructuredDataMedia->getMediaId(), '4:3', 1024));
    }
}
