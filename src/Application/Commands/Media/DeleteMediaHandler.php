<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use WouterDeSchuyter\Domain\Commands\Media\DeleteMedia;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class DeleteMediaHandler
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @param MediaRepository $mediaRepository
     */
    public function __construct(MediaRepository $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * @param DeleteMedia $deleteMedia
     */
    public function handle(DeleteMedia $deleteMedia)
    {
        $this->mediaRepository->delete($deleteMedia->getMediaId());
    }
}
