<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use Intervention\Image\ImageManager;
use WouterDeSchuyter\Domain\Commands\Media\ChangeRatio;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class ChangeRatioHandler
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var ImageManager
     */
    private $imageManager;

    /**
     * ChangeRatioHandler constructor.
     * @param MediaRepository $mediaRepository
     * @param ImageManager $imageManager
     */
    public function __construct(MediaRepository $mediaRepository, ImageManager $imageManager)
    {
        $this->mediaRepository = $mediaRepository;
        $this->imageManager = $imageManager;
    }

    /**
     * @param ChangeRatio $changeRatio
     */
    public function handle(ChangeRatio $changeRatio)
    {
        // TODO
    }
}
