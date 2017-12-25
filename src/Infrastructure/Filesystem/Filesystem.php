<?php

namespace WouterDeSchuyter\Infrastructure\Filesystem;

use Exception;
use League\Flysystem\Filesystem as LeagueFilesystem;
use Psr\Http\Message\StreamInterface;
use Slim\Http\Stream;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Media\MediaRepository;

class Filesystem
{
    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @var LeagueFilesystem
     */
    private $filesystem;

    /**
     * @param LeagueFilesystem $filesystem
     * @param MediaRepository $mediaRepository
     */
    public function __construct(LeagueFilesystem $filesystem, MediaRepository $mediaRepository)
    {
        $this->filesystem = $filesystem;
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * @param Media $media
     * @param StreamInterface $stream
     * @return bool
     */
    public function store(Media $media, StreamInterface $stream): bool
    {
        if ($this->filesystem->putStream($media->getPath(), $stream->detach()) === false) {
            return false;
        }

        $media->setMd5($this->filesystem->hash($media->getPath(), 'md5'));

        if ($media->isImage()) {
            $fullPath = APP_DIR . getenv('FILESYSTEM_DIR') . $media->getPath();
            $size = getimagesize($fullPath);
            $media->setWidth($size[0]);
            $media->setHeight($size[1]);
        }

        try {
            $this->mediaRepository->add($media);
        } catch (Exception $e) {
            $this->filesystem->delete($media->getPath());
            return false;
        }

        return true;
    }

    /**
     * @param Media $media
     * @return StreamInterface
     */
    public function get(Media $media): StreamInterface
    {
        return new Stream($this->filesystem->readStream($media->getPath()));
    }
}
