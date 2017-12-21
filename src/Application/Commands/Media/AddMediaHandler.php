<?php

namespace WouterDeSchuyter\Application\Commands\Media;

use WouterDeSchuyter\Domain\Commands\Media\AddMedia;
use WouterDeSchuyter\Domain\Media\Media;
use WouterDeSchuyter\Domain\Media\MediaBuilder;
use WouterDeSchuyter\Domain\Media\MediaContentTypeNotAllowedException;
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
        if (!in_array($addMedia->getUploadedFile()->getClientMediaType(), self::ALLOWED_CONTENT_TYPES)) {
            throw new MediaContentTypeNotAllowedException();
        }

        $builder = MediaBuilder::startWithDefault()
            ->withUserId($this->authenticatedUser->getUser()->getId())
            ->withName($addMedia->getUploadedFile()->getClientFilename())
            ->withContentType($addMedia->getUploadedFile()->getClientMediaType())
            ->withSize($addMedia->getUploadedFile()->getSize());

        if (!empty($addMedia->getLabel())) {
            $builder = $builder->withName($addMedia->getLabel());
        }

        $media = $builder->build();

        if ($this->filesystem->store($media, $addMedia->getUploadedFile()->getStream()) === false) {
            throw new StoreMediaFailedException();
        }
    }
}
