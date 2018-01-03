<?php

namespace WouterDeSchuyter\Infrastructure\Filesystem;

use League\Flysystem\Filesystem as LeagueFilesystem;
use Psr\Http\Message\StreamInterface;
use Slim\Http\Stream;
use WouterDeSchuyter\Domain\Media\Media;

class Filesystem
{
    /**
     * @var LeagueFilesystem
     */
    private $filesystem;

    /**
     * @param LeagueFilesystem $filesystem
     */
    public function __construct(LeagueFilesystem $filesystem)
    {
        $this->filesystem = $filesystem;
    }

    /**
     * @param Media $media
     * @param StreamInterface $stream
     * @return Media|null
     */
    public function store(Media $media, StreamInterface $stream): ?Media
    {
        if ($this->filesystem->putStream($media->getPath(), $stream->detach()) === false) {
            return null;
        }

        $media->setMd5($this->filesystem->hash($media->getPath(), 'md5'));

        if ($media->isImage()) {
            $fullPath = APP_DIR . getenv('FILESYSTEM_DIR') . $media->getPath();
            $size = getimagesize($fullPath);
            $media->setWidth($size[0]);
            $media->setHeight($size[1]);
        }

        return $media;
    }

    /**
     * @param Media $media
     * @return bool
     */
    public function remove(Media $media): bool
    {
        $this->filesystem->delete($media->getPath());

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
