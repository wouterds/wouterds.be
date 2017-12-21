<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use WouterDeSchuyter\Domain\Commands\Media\AddMedia;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Media\MediaContentTypeNotAllowedException;
use WouterDeSchuyter\Domain\Media\StoreMediaFailedException;
use WouterDeSchuyter\Domain\Users\AuthenticatedUser;
use WouterDeSchuyter\Infrastructure\Filesystem\Filesystem;

class AddMediaHandler
{
    private const allowedContentTypes = [
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
     * @param AuthenticatedUser $authenticatedUser
     * @param Filesystem $filesystem
     */
    public function __construct(AuthenticatedUser $authenticatedUser, Filesystem $filesystem)
    {
        $this->authenticatedUser = $authenticatedUser;
        $this->filesystem = $filesystem;
    }

    /**
     * @param AddMedia $addMedia
     * @throws MediaContentTypeNotAllowedException
     * @throws StoreMediaFailedException
     */
    public function handle(AddMedia $addMedia)
    {
        $media = new Media(
            $this->authenticatedUser->getUser()->getId(),
            $addMedia->getUploadedFile()->getClientFilename(),
            $addMedia->getUploadedFile()->getClientMediaType(),
            $addMedia->getUploadedFile()->getSize()
        );

        if (!in_array($media->getContentType(), self::allowedContentTypes)) {
            throw new MediaContentTypeNotAllowedException();
        }

        if (!empty($addMedia->getLabel())) {
            $media->setName($addMedia->getLabel());
        }

        if ($this->filesystem->store($media, $addMedia->getUploadedFile()->getStream()) === false) {
            throw new StoreMediaFailedException();
        }
    }
}
