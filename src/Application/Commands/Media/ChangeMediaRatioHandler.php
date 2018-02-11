<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use Intervention\Image\ImageManager;
use WouterDeSchuyter\Domain\Commands\Media\ChangeMediaRatio;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class ChangeMediaRatioHandler
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
     * @param MediaRepository $mediaRepository
     * @param ImageManager $imageManager
     */
    public function __construct(MediaRepository $mediaRepository, ImageManager $imageManager)
    {
        $this->mediaRepository = $mediaRepository;
        $this->imageManager = $imageManager;
    }

    /**
     * @param ChangeMediaRatio $changeMediaRatio
     */
    public function handle(ChangeMediaRatio $changeMediaRatio)
    {
        // TODO
    }
}
