<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use Exception;
use WouterDeSchuyter\Domain\Commands\Media\AddMedia;
use WouterDeSchuyter\Domain\Media\MediaBuilder;
use WouterDeSchuyter\Domain\Media\UnsupportedMediaException;
use WouterDeSchuyter\Domain\Media\MediaRepository;
use WouterDeSchuyter\Domain\Media\StoreMediaFailedException;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\Filesystem\Filesystem;

class AddMediaHandler
{
    private const ALLOWED_CONTENT_TYPES = [
        'image/jpeg',
    ];

    /**
     * @var AuthenticatedUser
     */
    private $authenticatedUser;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var MediaRepository
     */
    private $mediaRepository;

    /**
     * @param AuthenticatedUser $authenticatedUser
     * @param Filesystem $filesystem
     * @param MediaRepository $mediaRepository
     */
    public function __construct(AuthenticatedUser $authenticatedUser, Filesystem $filesystem, MediaRepository $mediaRepository)
    {
        $this->authenticatedUser = $authenticatedUser;
        $this->filesystem = $filesystem;
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     * @throws StoreMediaFailedException
     */
    public function handle(AddMedia $addMedia)
    {
        if (!empty($addMedia->getUrl())) {
            $this->handleUrlMedia($addMedia);
            return;
        }

        $this->handleFileMedia($addMedia);
    }

    /**
     * @param AddMedia $addMedia
     * @throws UnsupportedMediaException
     * @throws StoreMediaFailedException
     */
    private function handleFileMedia(AddMedia $addMedia)
    {
        if (!in_array($addMedia->getUploadedFile()->getClientMediaType(), self::ALLOWED_CONTENT_TYPES)) {
            throw new UnsupportedMediaException();
        }

        $builder = MediaBuilder::startWithDefault()
            ->withUserId($this->authenticatedUser->getUser()->getId())
            ->withName($addMedia->getUploadedFile()->getClientFilename())
            ->withContentType($addMedia->getUploadedFile()->getClientMediaType())
            ->withSize($addMedia->getUploadedFile()->getSize());

        if (!empty($addMedia->getLabel())) {
            $builder = $builder->withName($addMedia->getLabel());
        }

        $media = $this->filesystem->store($builder->build(), $addMedia->getUploadedFile()->getStream());

        if (empty($media)) {
            throw new StoreMediaFailedException();
        }

        try {
            $this->mediaRepository->add($media);
        } catch (Exception $e) {
            $this->filesystem->remove($media);
            throw new StoreMediaFailedException();
        }
    }

    /**
     * @param AddMedia $addMedia
     */
    private function handleUrlMedia(AddMedia $addMedia)
    {
        $host = strtolower(parse_url($addMedia->getUrl(), PHP_URL_HOST));

        if (in_array($host, ['youtube.com', 'youtu.be'])) {
            $this->handleYouTubeUrlMedia($addMedia);
        }

        // throw
    }

    /**
     * @param AddMedia $addMedia
     */
    private function handleYouTubeUrlMedia(AddMedia $addMedia)
    {
        // $meta = $this->getYouTubeMetaData
    }

    private function getYouTubeMetaData()
    {
    }
}
