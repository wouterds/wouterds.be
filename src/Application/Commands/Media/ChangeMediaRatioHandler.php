<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use Exception;
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
     * @throws Exception
     */
    public function handle(ChangeMediaRatio $changeMediaRatio)
    {
        // Get Media object
        $media = $this->mediaRepository->find($changeMediaRatio->getMediaId());

        // Not an image? Not resizeable!
        if (!$media->isImage()) {
            throw new Exception("Media ({$changeMediaRatio->getMediaId()}) object is not an image.");
        }

        // Create intervention object
        $image = $this->imageManager->make(APP_DIR . getenv('FILESYSTEM_DIR') . $media->getPath());

        // Fit image to new resolution
        $height = $changeMediaRatio->getRatio() * $changeMediaRatio->getWidth();
        if ($changeMediaRatio->getRatio() > 1) {
            $height = $changeMediaRatio->getWidth() / $changeMediaRatio->getRatio();
        }
        $image->fit($changeMediaRatio->getWidth(), (int) $height);

        $path = APP_DIR . getenv('FILESYSTEM_DIR') . $media->getPath();
        $extension = explode('.', $path);
        $extension = end($extension);
        $ratio = str_replace(':', 'x', $changeMediaRatio->getRatioStringValue());
        $path = str_replace(".{$extension}", ".{$ratio}.{$extension}", $path);
        $image->save($path, 70);
    }
}
